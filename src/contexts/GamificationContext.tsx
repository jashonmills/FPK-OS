
import React, { createContext, useContext } from 'react';

const GamificationContext = createContext({});

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GamificationContext.Provider value={{}}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
