import {useState, useEffect} from 'react';

/**
 * Generic hook that fetches data once on mount EXTRACTED FOR CPD.
 * @template T
 * @param {() => Promise<T>} fetcher - Async function that returns the data.
 * @param {T} initial - Initial value before data loads.
 * @returns {{data: T, loading: boolean, error: string | null}}
 */
export const useFetch = <T>(fetcher: () => Promise<T>, initial: T) => {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetcher()
        .then(setData)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
  }, []);

  return {data, loading, error};
};
