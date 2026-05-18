import {createContext, useContext} from 'react';
import type {SessionUser} from '../auth';

export const SellerContext = createContext<SessionUser | null>(null);

export const useSellerContext = () => useContext(SellerContext);
