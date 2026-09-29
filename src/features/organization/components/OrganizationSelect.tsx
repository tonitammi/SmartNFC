import { MenuItem, Select } from '@mui/material';
import type { UserOrganization } from '../types';
import { useOrganizationsQuery } from '../hooks/useOrganizationsQuery';
import { useAuthContext } from '../../auth/context/useAuthContext';
// import { useTranslation } from 'react-i18next';

export type OrganizationSelectProps = {
  onSelect: (org: UserOrganization) => void;
};

export const OrganizationSelect = () => {
  // const { t } = useTranslation('common');
  const { user } = useAuthContext();
  const { data: organizations, isLoading } = useOrganizationsQuery({ userId: user?.id });

  return (
    <>
      { !isLoading && organizations && (
        <Select value={organizations[0].id}>
          {organizations.map(({ id, name }) => (
            <MenuItem value={id}>{name}</MenuItem>
          ))}
        </Select>
      ) }
    </>
  );
};