import {getOrders, type SellerOrder} from '../api/orders';
import {useFetch} from './useFetch';
import {useSellerContext} from '../context/SellerContext';

/**
 * @returns Hook state with orders, loading, and error.
 */
export const useOrders = () => {
  const user = useSellerContext();
  const {data: orders, loading, error} = useFetch<SellerOrder[]>(
      () => user ? getOrders(user.id) : Promise.resolve([]), [],
  );
  return {orders, loading, error};
};
