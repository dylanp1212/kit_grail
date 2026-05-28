import {getOrders, type SellerOrder} from '../api/orders';
import {useFetch} from './useFetch';

/**
 * @returns Hook state with orders, loading, and error.
 */
export const useOrders = () => {
  const {data: orders, loading, error} = useFetch<SellerOrder[]>(
      () => getOrders(), [],
  );
  return {orders, loading, error};
};
