
import React, { createContext, useContext, useState } from 'react';

type SimpleOrganizationContextType = {
  currentOrganization: { name: string; id: string } | null;
  setCurrentOrganization: (org: { name: string; id: string } | null) => void;
};

const SimpleOrganizationContext = createContext<SimpleOrganizationContextType | undefined>(undefined);

export const SimpleOrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<{ name: string; id: string } | null>({
    name: "Tailor Task",
    id: "default"
  });

  return (
    <SimpleOrganizationContext.Provider value={{
      currentOrganization,
      setCurrentOrganization
    }}>
      {children}
    </SimpleOrganizationContext.Provider>
  );
};

export const useSimpleOrganization = () => {
  const context = useContext(SimpleOrganizationContext);
  if (context === undefined) {
    throw new Error('useSimpleOrganization must be used within a SimpleOrganizationProvider');
  }
  return context;
};
