import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Layout} from './Layout';
import type {SessionUser} from '../auth';
import {getSession} from '../auth';
import {SellerContext} from '../context/SellerContext';

export const ProtectedLayout = () => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSession()
        .then((u) => {
          if (!u) navigate('/login', {replace: true});
          else setUser(u);
        })
        .finally(() => setLoading(false));
  }, [navigate]);

  if (loading || !user) return null;

  return (
    <SellerContext.Provider value={user}>
      <Layout />
    </SellerContext.Provider>
  );
};
