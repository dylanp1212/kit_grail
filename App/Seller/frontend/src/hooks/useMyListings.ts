import {getAllListings, type MyListing} from '../api/listings';
import {useFetch} from './useFetch';

// *******
// hardcoded
// need to change
const userID = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a';
// *******

/**
 * @returns Hook state with listings, loading, and error.
 */
export const useMyListings = () => {
  const {data: listings, loading, error} = useFetch<MyListing[]>(
      () => getAllListings(userID), [],
  );
  return {listings, loading, error};
};
