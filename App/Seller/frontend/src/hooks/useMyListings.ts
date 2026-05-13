import {useState, useEffect} from 'react';
import {getAllListings, type MyListing} from '../api/listings';

export const useMyListings = () => {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllListings()
        .then((data) => setListings(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  return {listings, loading, error};
};
