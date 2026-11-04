import { GoogleGenerativeAI } from '@google/generative-ai'

// Keys are read at call time (not at import time), so it doesn't matter
// whether dotenv has loaded before this file is imported.
const env = (name, fallback = '') => (process.env[name] || fallback).trim()

// Models are tried in order; the next one is used if a model is unavailable.
const getModels = () =>
  [...new Set([env('GEMINI_MODEL', 'gemini-3.5-flash'), 'gemini-3.5-flash-lite'])]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Normalise messages: only user/assistant, non-empty, merge same-role neighbours,
// and make sure the conversation starts with a user message (Gemini requires it).
function normalise(messages = []) {
  const out = []
  for (const m of messages) {
    const content = String(m?.content ?? '').trim()
    if (!content) continue
    const role = m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user'
    const last = out[out.length - 1]
    if (last && last.role === role) last.content += '\n\n' + content
    else out.push({ role, content })
  }
  while (out.length && out[0].role !== 'user') out.shift()
  return out
}

// ---------------------------------------------------------------------------
// Gemini
// ---------------------------------------------------------------------------

/**
 * geminiChat(system, messages) -> string | null
 * messages: [{ role: 'user' | 'assistant', content: string }]
 * Returns null on any failure (never throws).
 */
export async function geminiChat(system, messages) {
  const apiKey = env('GEMINI_API_KEY')
  if (!apiKey) {
    console.error('[aiProvider] GEMINI_API_KEY is missing')
    return null
  }

  const msgs = normalise(messages)
  if (!msgs.length) return null

  const genAI = new GoogleGenerativeAI(apiKey)
  const contents = msgs.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  for (const name of getModels()) {
    try {
      const model = genAI.getGenerativeModel({
        model: name,
        ...(system ? { systemInstruction: system } : {}),
      })
      const result = await model.generateContent({
        contents,
        generationConfig: { temperature: 0.7 },
      })
      const text = result.response.text()
      if (text) return text
    } catch (e) {
      console.error(`[aiProvider] Gemini error (${name}):`, e.message)
      // 404 / 503 / 429 -> try the next model; anything else -> stop
      if (!/404|503|429|not found|overloaded|high demand/i.test(e.message)) break
    }
  }
  return null
}

/**
 * geminiComplete(prompt, system?) -> string | null
 * Single-prompt helper (used by resumeAnalyzer.js and similar files).
 */
export async function geminiComplete(prompt, system = 'You are a helpful assistant.') {
  return aiChat(system, [{ role: 'user', content: String(prompt ?? '') }])
}

// ---------------------------------------------------------------------------
// Together AI (optional fallback)
// ---------------------------------------------------------------------------

export async function togetherChat(system, messages) {
  const apiKey = env('TOGETHER_API_KEY')
  if (!apiKey) return null

  const msgs = normalise(messages)
  if (!msgs.length) return null

  try {
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: env('TOGETHER_MODEL', 'meta-llama/Llama-3.3-70B-Instruct-Turbo'),
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...msgs,
        ],
        temperature: 0.7,
      }),
    })
    if (!res.ok) {
      console.error('[aiProvider] Together error:', res.status, await res.text())
      return null
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch (e) {
    console.error('[aiProvider] Together error:', e.message)
    return null
  }
}

// ---------------------------------------------------------------------------
// Combined: try Gemini first, then Together
// ---------------------------------------------------------------------------

export async function aiChat(system, messages) {
  const geminiReply = await geminiChat(system, messages)
  if (geminiReply) return geminiReply
  return togetherChat(system, messages)
}

// Handy for health checks / conditional UI
export const isAIConfigured = () => Boolean(env('GEMINI_API_KEY') || env('TOGETHER_API_KEY'))