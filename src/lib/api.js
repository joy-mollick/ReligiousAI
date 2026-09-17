const DEFAULT_API =
  'https://asia-south1-religiousai-cd37d.cloudfunctions.net/quranApi'

export const API_BASE = (
  import.meta.env.VITE_QURAN_AI_API || DEFAULT_API
).replace(/\/$/, '')

export async function askQuranAI({
  message,
  language = 'auto',
  history = [],
}) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      message,
      language,
      history: Array.isArray(history) ? history.slice(-10) : [],
    }),
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The server returned an unreadable response.')
  }

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.message ||
        data?.details ||
        'Quran AI could not answer right now. Please try again.',
    )
  }

  return data
}
