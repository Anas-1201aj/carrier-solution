import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { StudentProfile } from '../models/StudentProfile.js'
import { CareerRoadmap } from '../models/CareerRoadmap.js'
import { Notification } from '../models/Notification.js'
import { calcReadinessScore } from '../services/careerEngine.js'

const router = Router()

const PROFILE_FIELDS = [
  'educationLevel', 'degree', 'graduationYear', 'technicalSkills', 'interests',
  'targetRoles', 'careerGoals', 'college', 'university', 'skillsToLearn',
  'experienceLevel', 'weeklyLearningTime', 'onboardingStep', 'onboardingComplete',
]

// GET /api/profile
router.get('/', async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.userId }).lean()
    const roadmap = await CareerRoadmap.findOne({ userId: req.userId, active: true }).lean()
    const unreadNotifications = await Notification.countDocuments({ userId: req.userId, read: false })
    res.json({ profile, roadmap, unreadNotifications })
  } catch (e) { next(e) }
})

// PUT /api/profile
// Note: .optional({ values: 'falsy' }) skips validation for '', 0, null, undefined, false
// This is needed because the onboarding form sends ALL fields on each step (unfilled ones are '')
router.put('/', [
  body('educationLevel').optional({ values: 'falsy' }).isString(),
  body('degree').optional({ values: 'falsy' }).isString(),
  body('graduationYear').optional({ values: 'falsy' }).isString(),
  body('careerGoals').optional({ values: 'falsy' }).isString(),
  body('experienceLevel').optional({ values: 'falsy' }).isIn(['no-experience', 'some-projects', 'internship', 'professional']),
  body('weeklyLearningTime').optional().toInt().isInt({ min: 1, max: 80 }),
  body('onboardingStep').optional().toInt().isInt({ min: 0, max: 5 }),
  body('onboardingComplete').optional().toBoolean().isBoolean(),
  body('technicalSkills').optional().isArray(),
  body('interests').optional().isArray(),
  body('targetRoles').optional().isArray(),
  body('skillsToLearn').optional().isArray(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid profile data', errors: errors.array() })

    const update = Object.fromEntries(
      PROFILE_FIELDS.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]])
    )

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: update, $setOnInsert: { userId: req.userId } },
      { upsert: true, new: true }
    )

    // Recalculate readiness score
    const roadmap = await CareerRoadmap.findOne({ userId: req.userId, active: true })
    const readinessScore = calcReadinessScore(profile, roadmap)
    await StudentProfile.findByIdAndUpdate(profile._id, { readinessScore })

    // Notify on onboarding complete
    if (req.body.onboardingComplete === true) {
      const alreadyNotified = await Notification.findOne({ userId: req.userId, type: 'achievement', title: 'Profile Complete!' })
      if (!alreadyNotified) {
        await Notification.create({
          userId: req.userId,
          type: 'achievement',
          title: 'Profile Complete!',
          message: 'Great work! Your career profile is set up. Check out your personalized roadmap.',
          actionUrl: '/roadmap',
          actionLabel: 'View Roadmap',
        })
      }
    }

    res.json({ profile: { ...profile.toObject(), readinessScore } })
  } catch (e) { next(e) }
})

export default router
