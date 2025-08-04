
import React, { createContext, useContext } from 'react';

const VoiceSettingsContext = createContext({});

export const VoiceSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <VoiceSettingsContext.Provider value={{}}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export const useVoiceSettings = () => useContext(VoiceSettingsContext);
