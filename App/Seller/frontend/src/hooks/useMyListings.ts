import {useState, useEffect} from 'react';
import {getAllListings, type MyListing} from '../api/listings';

// hardcoded
// need to change
const userID = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a';
export const useMyListings = () => {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllListings(userID)
        .then((data) => setListings(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  return {listings, loading, error};
};
