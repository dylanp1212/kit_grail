// Gemini adapter. When GEMINI_API_KEY is unset (tests, CI without secrets,
// local dev) we fall back to deterministic stubs so the rest of the pipeline
// can be exercised end-to-end without a real API call.

const EMBED_DIM = 768
const DEFAULT_EMBED_MODEL = 'gemini-embedding-001'
const DEFAULT_GEN_MODEL = 'gemini-2.5-flash'

// The LLM only emits index references — URL and title are filled in from
// the retrieved chunks by HistoryService, so a hallucinated URL is
// structurally impossible.
export interface ModelCitation {
  index: number
}

export interface ModelOutput {
  summary: string
  citations: ModelCitation[]
}

interface GeminiEmbedResponse {
  embedding?: {values: number[]}
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {parts?: Array<{text?: string}>}
  }>
}

export class LlmClient {
  private apiKey: string | undefined
  private embedModel: string
  private genModel: string
  private fetchFn: typeof fetch

  constructor(opts?: {
    apiKey?: string
    embedModel?: string
    genModel?: string
    fetchFn?: typeof fetch
  }) {
    this.apiKey = opts?.apiKey ?? process.env.GEMINI_API_KEY
    this.embedModel = opts?.embedModel ?? process.env.HISTORY_EMBED_MODEL ?? DEFAULT_EMBED_MODEL
    this.genModel = opts?.genModel ?? process.env.HISTORY_GEN_MODEL ?? DEFAULT_GEN_MODEL
    this.fetchFn = opts?.fetchFn ?? fetch
  }

  public get stubbed(): boolean {
    return !this.apiKey
  }

  public async embed(text: string): Promise<number[]> {
    if (!this.apiKey) return stubEmbed(text)
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${this.embedModel}` +
      `:embedContent?key=${encodeURIComponent(this.apiKey)}`
    const res = await this.fetchFn(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: `models/${this.embedModel}`,
        content: {parts: [{text}]},
        outputDimensionality: EMBED_DIM,
      }),
    })
    if (!res.ok) throw new Error(`Gemini embed failed: ${res.status}`)
    const body = (await res.json()) as GeminiEmbedResponse
    const values = body.embedding?.values
    if (!values || values.length !== EMBED_DIM) {
      throw new Error('Gemini embed returned wrong shape')
    }
    return values
  }

  public async generate(prompt: string): Promise<ModelOutput> {
    if (!this.apiKey) return stubGenerate(prompt)
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${this.genModel}` +
      `:generateContent?key=${encodeURIComponent(this.apiKey)}`
    const res = await this.fetchFn(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        contents: [{parts: [{text: prompt}]}],
        generationConfig: {responseMimeType: 'application/json'},
      }),
    })
    if (!res.ok) throw new Error(`Gemini generate failed: ${res.status}`)
    const body = (await res.json()) as GeminiGenerateResponse
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Gemini generate returned no text')
    const parsed = JSON.parse(text) as ModelOutput
    if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.citations)) {
      throw new Error('Gemini generate returned wrong shape')
    }
    return parsed
  }
}

// Deterministic stubs. Same text → same vector. Test-friendly.

export function stubEmbed(text: string): number[] {
  const vec = new Array<number>(EMBED_DIM).fill(0)
  for (let i = 0; i < text.length; i++) {
    vec[i % EMBED_DIM] += text.charCodeAt(i) / 1000
  }
  // L2 normalize so the magnitude is stable
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1
  return vec.map((x) => x / norm)
}

export function stubGenerate(prompt: string): ModelOutput {
  // Pull the first [N] source line out of the prompt so the stub appears
  // to "use" what was given to it.
  const sourceMatch = prompt.match(/\[(\d+)\]\s+/)
  const idx = sourceMatch ? parseInt(sourceMatch[1], 10) : 1
  return {
    summary: `Stubbed history citing [${idx}].`,
    citations: [{index: idx}],
  }
}
