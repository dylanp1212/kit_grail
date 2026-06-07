"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchListing = fetchListing;
exports.retrievalQuery = retrievalQuery;
const kitListingUrl = () => process.env.KIT_LISTING_MS_URL ?? 'http://localhost:3011/api/v0';
async function fetchListing(id, fetchFn = fetch) {
    const res = await fetchFn(`${kitListingUrl()}/kit-listing/${id}`);
    if (res.status === 404)
        return null;
    if (!res.ok)
        throw new Error(`fetchListing failed: ${res.status}`);
    return (await res.json());
}
function retrievalQuery(listing) {
    const structured = [listing.player, listing.club, listing.season, listing.competition]
        .filter((v) => typeof v === 'string' && v.length > 0);
    if (structured.length > 0) {
        return structured.join(' ');
    }
    return `${listing.title}. ${listing.description.slice(0, 300)}`;
}
