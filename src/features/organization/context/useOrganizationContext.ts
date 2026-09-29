import { useContext } from 'react';
import { OrganizationContext, type OrganizationContextValue } from './OrganizationContext';

interface GuaranteedOrganizationContextValue extends OrganizationContextValue {
  currentOrganization: NonNullable<OrganizationContextValue['currentOrganization']>;
}

function useOrganizationContext(): OrganizationContextValue; 
function useOrganizationContext(currentOrgGuaranteed: 'true'): GuaranteedOrganizationContextValue;
function useOrganizationContext(currentOrgGuaranteed?: 'true'): OrganizationContextValue | GuaranteedOrganizationContextValue {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error('useOrganizationContext must be used within an OrganizationContextProvider');
  }

  if (currentOrgGuaranteed) {
    if (!context.currentOrganization) {
      throw new Error(
        'useOrganizationContext with parameter currentOrgGuaranteed is true must be used where currentOrganization is not null'
      );
    }
    return context as GuaranteedOrganizationContextValue;
  }

  return context;
};

export { useOrganizationContext };