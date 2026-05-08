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
export async function getMyListings(): Promise<MyListing[]> {
  const res = await fetch('/api/v0/my-listings');
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
