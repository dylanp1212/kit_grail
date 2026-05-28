type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface MyListing {
  id: string;
  seller: string
  title: string;
  description: string;
  size: Size;
  colors: string[];
  listed: string;
  price: number;
  image: string;
}

export interface NewListing {
  seller: string,
  title: string,
  description: string,
  size: Size,
  colors: string[],
  price: number,
  image?: string
}

// const MS_URL = 'http://localhost:3011/api/v0/kit-listing'

// we can get rid of the jsdoc since were using ts i think

/**
 * Fetches all listings for the current seller (from the session cookie).
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
  // const res = await fetch(`${MS_URL}/${listingID}`)
  // if (res.status === 404) return null
  // return res.json() as Promise<MyListing>
}


/**
 * creates new listing
 * @param {NewListing} newListing new listing to be created
 * @returns {Promise<MyListing>} A promise resolving to a listing.
 */
export async function createNewListing(
    newListing: NewListing): Promise<MyListing> {
  const res = await fetch('/api/v0/my-listings', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newListing),
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
