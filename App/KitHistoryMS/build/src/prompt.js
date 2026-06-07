"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assemblePrompt = assemblePrompt;
const CHUNK_CHAR_BUDGET = 1500;
function clamp(text) {
    return text.length > CHUNK_CHAR_BUDGET
        ? text.slice(0, CHUNK_CHAR_BUDGET) + '...'
        : text;
}
function structuredLine(listing) {
    const parts = [];
    if (listing.player)
        parts.push(`Player: ${listing.player}`);
    if (listing.club)
        parts.push(`Club: ${listing.club}`);
    if (listing.season)
        parts.push(`Season: ${listing.season}`);
    if (listing.competition)
        parts.push(`Competition: ${listing.competition}`);
    return parts.length > 0 ? parts.join(', ') : null;
}
function assemblePrompt(input) {
    const structured = structuredLine(input.listing);
    const lines = [
        'You are writing a short, factual historical context blurb for a soccer jersey listing.',
        '',
        'Listing:',
        `  Title: ${input.listing.title}`,
        `  Description: ${input.listing.description.slice(0, 500)}`,
        ...(structured ? [`  ${structured}`] : []),
        '',
        'Sources (the ONLY material you may use; cite with [N]):',
        ...input.chunks.map((c, i) => `[${i + 1}] ${c.source_title}: ${clamp(c.text)}`),
        '',
        'Instructions:',
        '- Write 2-3 sentences about this specific jersey using ONLY the sources above.',
        '- Cite every factual claim with [N], where N matches the source number above.',
        '- If the sources do not support a claim, leave it out. Better short than wrong.',
        '- Do NOT invent facts, players, dates, or matches not present in the sources.',
        '',
        'Return strict JSON with this shape:',
        '{ "summary": "...", "citations": [{ "index": N }] }',
        'Include one citation entry per distinct [N] referenced in the summary.',
    ];
    return lines.join('\n');
}
