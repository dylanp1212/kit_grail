import {useState, useEffect} from 'react';
import {getMyListings, type MyListing} from '../api/listings';

export const useMyListings = () => {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyListings()
        .then((data) => setListings(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  return {listings, loading, error};
};
