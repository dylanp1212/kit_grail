import {getAllListings, type MyListing} from '../api/listings';
import {useFetch} from './useFetch';
import {useSellerContext} from '../context/SellerContext';

/**
 * @returns Hook state with listings, loading, and error.
 */
export const useMyListings = () => {
  const user = useSellerContext();
  const {data: listings, loading, error} = useFetch<MyListing[]>(
      () => user ? getAllListings(user.id) : Promise.resolve([]), [],
  );
  return {listings, loading, error};
};
