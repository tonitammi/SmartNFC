import type { OrganizationUser } from '../types';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import SimpleMenu from '@src/components/navigation/SimpleMenu';
import { MenuItem } from '@mui/material';
import { useOrganizationUserMutations } from '../hooks/useOrganizationUserMutations';
import { useOrganizationContext } from '../../organization/context/useOrganizationContext';
import { useAuthContext } from '../../auth/context/useAuthContext';

interface OrganizationUsersListProps {
  users: OrganizationUser[];
  page?: number;
  perPage?: number;
}

export const OrganizationUserList = ({ users, page = 0, perPage = 20 } : OrganizationUsersListProps) => {
  const { t } = useTranslation('common');
  const { currentOrganization } = useOrganizationContext('true');
  const { user } = useAuthContext();
  const { deleteMutation } = useOrganizationUserMutations(currentOrganization.id);


  const columns: GridColDef[] = useMemo(() => ([
    {
      field: 'id',
      headerName: '-',
      renderCell: (params) => (
        <SimpleMenu buttonLabel="Actions">
          <MenuItem 
            disabled={deleteMutation.isPending || user?.id === params.row.user_id}
            onClick={() => deleteMutation.mutateAsync({ userId: params.row.user_id })}
          >
            {
              deleteMutation.isPending ? 
              t('actions.deleting')
              :
              t('organization_users.delete_user', { ns: 'components' })
            }
            
          </MenuItem>
        </SimpleMenu>
      ),
    },
    { field: 'email', headerName: t('fields.email'), width: 180 },
    { field: 'role', headerName: t('fields.role'), width: 120 },
    { 
      field: 'created_at', 
      headerName: t('fields.created_at'),
      width: 120,
      valueFormatter: (val) => val && new Date(val).toLocaleDateString(), 
    },
  ]), [t, user, deleteMutation]);

  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid 
        columns={columns}
        rows={users}
        initialState={{ 
          pagination: { 
            paginationModel: { 
              page, 
              pageSize: perPage, 
            },
          }, 
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Paper>
  );
};