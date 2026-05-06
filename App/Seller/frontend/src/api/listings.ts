export interface MyListing {
  id: string;
  title: string;
  description: string;
  size: string;
  colors: string[];
  listed: boolean;
  price: number;
  image: string;
}

/**
 *
 */
export async function getMyListings(): Promise<MyListing[]> {
  const res = await fetch('/api/v0/my-listings');
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return res.json();
}
