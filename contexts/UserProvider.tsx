'use client';

import { User } from '@/types/api/user';
import { createContext, useContext, useEffect, useState } from 'react';

type UserState = {
  user: User | null;
  setUser: (u: User | null) => void;
};

const userContext = createContext<UserState | undefined>(undefined);

export const UserProvider = ({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const [user, setUser] = useState<User | null>(initialUser);
  return <userContext.Provider value={{ user, setUser }}>{children}</userContext.Provider>;
};

export const useUser = () => {
  const context = useContext(userContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
