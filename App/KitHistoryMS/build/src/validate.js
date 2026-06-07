"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCitations = validateCitations;
function validateCitations(output, retrieved) {
    const allowed = new Set();
    for (let i = 0; i < retrieved.length; i++)
        allowed.add(i + 1);
    const seen = new Set();
    for (const c of output.citations) {
        if (!Number.isInteger(c.index)) {
            return { ok: false, reason: `Citation index not an integer: ${String(c.index)}` };
        }
        if (!allowed.has(c.index)) {
            return { ok: false, reason: `Citation [${c.index}] not in retrieved set (1..${retrieved.length})` };
        }
        if (seen.has(c.index)) {
            return { ok: false, reason: `Citation [${c.index}] appears more than once` };
        }
        seen.add(c.index);
    }
    const summaryRefs = [...output.summary.matchAll(/\[(\d+)\]/g)].map((m) => parseInt(m[1], 10));
    for (const ref of summaryRefs) {
        if (!seen.has(ref)) {
            return { ok: false, reason: `Summary cites [${ref}] but no citation entry exists for it` };
        }
    }
    return { ok: true };
}
