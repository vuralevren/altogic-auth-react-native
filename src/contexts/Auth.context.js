import React, { useState, useEffect, useContext } from 'react';
import storage from '../configs/storage';

const Context = React.createContext(null);

const useFetchAuth = () => {
  const [fetchedAuth, setFetchedAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if session information is exist in storage
    storage.get(storage.KEY_AUTH).then((authFromStorage) => {
      setFetchedAuth(authFromStorage);
      setIsLoading(false);
    });
  }, []);

  return { fetchedAuth, isLoading };
};

const Provider = ({ children }) => {
  const { fetchedAuth, isLoading } = useFetchAuth();
  const [auth, setAuth] = useState(fetchedAuth);

  useEffect(() => {
    // Set session information to auth state if it's exist in storage
    setAuth(fetchedAuth);
  }, [fetchedAuth]);

  useEffect(() => {
    // Set session information to storage when auth state's changed
    storage.set(storage.KEY_AUTH, auth);
  }, [auth]);

  return (
    <Context.Provider value={[auth, setAuth, isLoading]}>
      {children}
    </Context.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(Context);
  return context;
};

export default Provider;
