import { Router } from 'express'
import { aiChat as geminiChat } from '../services/aiProvider.js'
import { body, param, query, validationResult } from 'express-validator'
import { MockInterview } from '../models/MockInterview.js'
// import { geminiChat } from '../services/aiProvider.js'

const router = Router()

// ---------- helpers ----------
async function geminiJSON(system, prompt) {
  const text = await geminiChat(system, [{ role: 'user', content: prompt }])
  if (!text) return null
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return null
  }
}

const JSON_ONLY = 'You respond only with valid JSON, no explanations and no markdown.'
const roleCache = new Map()

const DIFFICULTY_GUIDE = {
  easy: 'fundamentals and basic concepts, suitable for a beginner or fresher',
  medium: 'practical, hands-on experience, suitable for 2-4 years of experience',
  hard: 'deep trade-offs, edge cases, system design and leadership, suitable for a senior candidate',
}

const SYSTEM_PROMPT = (role, type, difficulty) =>
  `You are an experienced interviewer conducting a ${difficulty} ${type} mock interview for a "${role}" position. Be concise, professional, encouraging but honest.`

// ---------- routes ----------

// GET /api/interview/roles?q=front  (must stay ABOVE '/:id')
router.get('/roles', async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase().slice(0, 60)
  if (q.length < 2) return res.json({ roles: [] })
  if (roleCache.has(q)) return res.json({ roles: roleCache.get(q) })

  try {
    const result = await geminiJSON(
      JSON_ONLY,
      `Return a JSON array of up to 8 real job role titles that match or are closely related to "${q}". Strings only, no duplicates, title case.`
    )
    const roles = (Array.isArray(result) ? result : [])
      .filter((r) => typeof r === 'string')
      .slice(0, 8)

    if (roles.length) roleCache.set(q, roles)
    res.json({ roles })
  } catch (e) {
    console.error('ROLES ERROR:', e)   // this shows the real cause
    res.json({ roles: [] })            // frontend still offers "Use <typed role>"
  }
})

// GET /api/interview — list interviews
router.get('/', async (req, res, next) => {
  try {
    const interviews = await MockInterview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-messages -questions')
    res.json({ interviews })
  } catch (e) { next(e) }
})

// POST /api/interview/start
router.post('/start', [
  body('role').isString().isLength({ min: 2 }),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  body('interviewType').optional().isIn(['behavioral', 'technical', 'mixed']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Please specify a role for the interview' })

    const role = req.body.role.trim()
    const interviewType = req.body.interviewType || 'mixed'
    const difficulty = req.body.difficulty || 'medium'

    const questions = await geminiJSON(
      JSON_ONLY,
      `Create 8 interview questions for a "${role}" position.
Difficulty: ${difficulty} (${DIFFICULTY_GUIDE[difficulty]}).
Type: ${interviewType}. "behavioral" = situational / past-experience questions; "technical" = role-specific skills, concepts and problem solving; "mixed" = roughly half of each.
Order them from warm-up to hardest. Return a JSON array of 8 strings only.`
    )

    const clean = (Array.isArray(questions) ? questions : [])
      .filter((q) => typeof q === 'string' && q.trim())
      .slice(0, 10)

    if (!clean.length) {
      return res.status(502).json({ message: 'Could not generate questions right now. Please try again.' })
    }

    const greeting = `Hi! I'm your AI interviewer today. I'll be conducting a ${difficulty} ${interviewType} interview for the "${role}" position. Take your time, and I'll give brief feedback after each answer.\n\nLet's begin:\n\n${clean[0]}`

    const interview = await MockInterview.create({
      userId: req.userId,
      role, difficulty, interviewType,
      questions: clean,
      currentIndex: 0,
      messages: [{ role: 'assistant', content: greeting }],
    })

    res.status(201).json({ interview })
  } catch (e) { next(e) }
})

// GET /api/interview/:id
router.get('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.userId })
    if (!interview) return res.status(404).json({ message: 'Interview not found' })
    res.json({ interview })
  } catch (e) { next(e) }
})

// POST /api/interview/:id/message
router.post('/:id/message', [param('id').isMongoId(), body('content').isString().isLength({ min: 1, max: 2000 })], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid message' })

    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.userId })
    if (!interview || interview.completed) return res.status(404).json({ message: 'Interview not found or completed' })

    interview.messages.push({ role: 'user', content: req.body.content })
    interview.questionsAsked = (interview.questionsAsked || 0) + 1

    const next = (interview.currentIndex || 0) + 1
    const hasNext = next < interview.questions.length

    const transcript = interview.messages
      .slice(-10)
      .map((m) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`)
      .join('\n')

    const prompt = `Conversation so far:\n${transcript}\n\nReact to the candidate's last answer in 1-2 sentences (brief, specific feedback). ${
      hasNext
        ? `Then ask exactly this next question: "${interview.questions[next]}"`
        : 'Then tell them the interview is complete and they can click "Finish & get feedback".'
    }`

    const aiResponse = await geminiChat(
      SYSTEM_PROMPT(interview.role, interview.interviewType, interview.difficulty),
      [{ role: 'user', content: prompt }]
    )

    // If Gemini fails, still move the interview forward using the generated question
    const reply = aiResponse ||
      (hasNext
        ? `Thanks for sharing that.\n\nNext question:\n\n${interview.questions[next]}`
        : 'Thanks for your answers. The interview is complete. Click "Finish & get feedback" to see your results.')

    interview.messages.push({ role: 'assistant', content: reply })
    if (hasNext) interview.currentIndex = next
    await interview.save()

    res.json({ reply, finished: !hasNext, interview })
  } catch (e) { next(e) }
})

// POST /api/interview/:id/complete  (unchanged)
router.post('/:id/complete', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, userId: req.userId })
    if (!interview) return res.status(404).json({ message: 'Interview not found' })

    const feedbackPrompt = `Based on this interview conversation, provide structured feedback as JSON:
{
  "overall": "<2-3 sentence overall assessment>",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "score": <0-100>
}

Interview transcript:
${interview.messages.map((m) => `${m.role}: ${m.content}`).join('\n\n').slice(0, 3000)}`

    const aiText = await geminiChat('You are an expert interview coach. Respond only with valid JSON.', [{ role: 'user', content: feedbackPrompt }])

    let feedback = { overall: 'Great effort on your mock interview! Keep practicing.', strengths: ['You participated fully'], improvements: ['Continue practicing and refining your answers'], score: 70 }

    if (aiText) {
      try { feedback = JSON.parse(aiText.replace(/```json|```/g, '').trim()) } catch {}
    }

    interview.feedback = feedback
    interview.completed = true
    interview.completedAt = new Date()
    await interview.save()

    res.json({ feedback, interview })
  } catch (e) { next(e) }
})

export default router