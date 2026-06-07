"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmClient = void 0;
exports.stubEmbed = stubEmbed;
exports.stubGenerate = stubGenerate;
const EMBED_DIM = 768;
const DEFAULT_EMBED_MODEL = 'gemini-embedding-001';
const DEFAULT_GEN_MODEL = 'gemini-2.5-flash';
class LlmClient {
    apiKey;
    embedModel;
    genModel;
    fetchFn;
    constructor(opts) {
        this.apiKey = opts?.apiKey ?? process.env.GEMINI_API_KEY;
        this.embedModel = opts?.embedModel ?? process.env.HISTORY_EMBED_MODEL ?? DEFAULT_EMBED_MODEL;
        this.genModel = opts?.genModel ?? process.env.HISTORY_GEN_MODEL ?? DEFAULT_GEN_MODEL;
        this.fetchFn = opts?.fetchFn ?? fetch;
    }
    get stubbed() {
        return !this.apiKey;
    }
    async embed(text) {
        if (this.stubbed)
            return stubEmbed(text);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.embedModel}` +
            `:embedContent?key=${encodeURIComponent(this.apiKey ?? '')}`;
        const res = await this.fetchFn(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: `models/${this.embedModel}`,
                content: { parts: [{ text }] },
                outputDimensionality: EMBED_DIM,
            }),
        });
        if (!res.ok)
            throw new Error(`Gemini embed failed: ${res.status}`);
        const body = (await res.json());
        const values = body.embedding?.values;
        if (!values || values.length !== EMBED_DIM) {
            throw new Error(`Gemini embed returned wrong shape: ${values?.length ?? 'none'} dims`);
        }
        return values;
    }
    async generate(prompt) {
        if (this.stubbed)
            return stubGenerate(prompt);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.genModel}` +
            `:generateContent?key=${encodeURIComponent(this.apiKey ?? '')}`;
        const res = await this.fetchFn(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' },
            }),
        });
        if (!res.ok)
            throw new Error(`Gemini generate failed: ${res.status}`);
        const body = (await res.json());
        const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text)
            throw new Error('Gemini generate returned no text');
        const parsed = JSON.parse(text);
        if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.citations)) {
            throw new Error('Gemini generate returned wrong shape');
        }
        return parsed;
    }
}
exports.LlmClient = LlmClient;
function stubEmbed(text) {
    const vec = new Array(EMBED_DIM).fill(0);
    for (let i = 0; i < text.length; i++) {
        vec[i % EMBED_DIM] += text.charCodeAt(i) / 1000;
    }
    const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1;
    return vec.map((x) => x / norm);
}
function stubGenerate(prompt) {
    const sourceMatch = prompt.match(/\[(\d+)\]\s+/);
    const idx = sourceMatch ? parseInt(sourceMatch[1], 10) : 1;
    return {
        summary: `Stubbed history citing [${idx}].`,
        citations: [{ index: idx }],
    };
}
