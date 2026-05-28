import {getAllListings, type MyListing} from '../api/listings';
import {useFetch} from './useFetch';

/**
 * @returns Hook state with listings, loading, and error.
 */
export const useMyListings = () => {
  const {data: listings, loading, error} = useFetch<MyListing[]>(
      () => getAllListings(), [],
  );
  return {listings, loading, error};
};
