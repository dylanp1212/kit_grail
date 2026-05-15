export interface MyListing {
  id: string;
  title: string;
  description: string;
  size: string;
  colors: string[];
  listed: string;
  price: number;
  image: string;
}

// const MS_URL = 'http://localhost:3011/api/v0/kit-listing'

/**
 * Fetches all listings for the current seller.
 * @returns {Promise<MyListing[]>} A promise resolving to an array of listings.
 */
export async function getAllListings(userID: string): Promise<MyListing[]> {
  const res = await fetch(`/api/v0/my-listings/all?userID=${encodeURIComponent(userID)}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
  // const url = search ? `${MS_URL}?search=${encodeURIComponent(search)}` : MS_URL
  // const res = await fetch(url)
  // return res.json() as Promise<MyListing[]>
}

/**
 * Fetches a specific listing based on ID.
 * @param {string} listingID ID of the listing
 * @returns {Promise<MyListing>} A promise resolving to a listing.
 */
export async function getListing(listingID: string): Promise<MyListing> {
  const res = await fetch(`/api/v0/my-listings/${listingID}`);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
  // const res = await fetch(`${MS_URL}/${listingID}`)
  // if (res.status === 404) return null
  // return res.json() as Promise<MyListing>
}
