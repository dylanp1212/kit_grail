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

/**
 * Fetches all listings for the current seller.
 * @returns {Promise<MyListing[]>} A promise resolving to an array of listings.
 */
export async function getAllListings(): Promise<MyListing[]> {
  const res = await fetch('/api/v0/my-listings/all');
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
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
}
