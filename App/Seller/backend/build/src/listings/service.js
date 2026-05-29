"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const MS_URL = 'http://localhost:3011/api/v0/kit-listing';
class ListingService {
    async getMyListings(userID) {
        const params = new URLSearchParams();
        params.set('sellerId', userID);
        const qs = params.toString();
        const res = await fetch(`${MS_URL}?${qs}`);
        return res.json();
    }
    async getListing(listingID) {
        const res = await fetch(`${MS_URL}/${listingID}`);
        if (res.status === 404)
            return undefined;
        return res.json();
    }
    async createNewListing(newListing, jwe) {
        const res = await fetch(`${MS_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwe}`,
            },
            body: JSON.stringify(newListing),
        });
        if (res.status === 400)
            return undefined;
        return res.json();
    }
    async editListing(listing, listingID, jwe) {
        const res = await fetch(`${MS_URL}/${listingID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwe}`,
            },
            body: JSON.stringify(listing),
        });
        if (res.status === 400)
            return undefined;
        return res.json();
    }
}
exports.ListingService = ListingService;
