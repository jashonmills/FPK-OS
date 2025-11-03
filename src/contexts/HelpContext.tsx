import { createContext, useContext, useState, ReactNode } from 'react';

interface HelpContextType {
  isHelpCenterOpen: boolean;
  openHelpCenter: (articleSlug?: string) => void;
  closeHelpCenter: () => void;
  currentArticleSlug: string | null;
  setCurrentArticleSlug: (slug: string | null) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider = ({ children }: { children: ReactNode }) => {
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(null);

  const openHelpCenter = (articleSlug?: string) => {
    if (articleSlug) {
      setCurrentArticleSlug(articleSlug);
    }
    setIsHelpCenterOpen(true);
  };

  const closeHelpCenter = () => {
    setIsHelpCenterOpen(false);
  };

  return (
    <HelpContext.Provider
      value={{
        isHelpCenterOpen,
        openHelpCenter,
        closeHelpCenter,
        currentArticleSlug,
        setCurrentArticleSlug,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within HelpProvider');
  }
  return context;
};
