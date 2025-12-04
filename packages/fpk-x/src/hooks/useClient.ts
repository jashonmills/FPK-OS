import { useFamily } from '@/contexts/FamilyContext';

export const useClient = () => {
  const context = useFamily();
  
  return {
    selectedClient: context.selectedClient,
    clients: context.clients,
    isNewModel: context.isNewModel,
    setSelectedClient: context.setSelectedClient,
  };
};
