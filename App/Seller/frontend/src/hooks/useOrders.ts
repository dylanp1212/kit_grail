import {getOrders, type SellerOrder} from '../api/orders';
import {useFetch} from './useFetch';

const userID = '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a';

/**
 * @returns Hook state with orders, loading, and error.
 */
export const useOrders = () => {
  const {data: orders, loading, error} = useFetch<SellerOrder[]>(
      () => getOrders(userID), [],
  );
  return {orders, loading, error};
};
