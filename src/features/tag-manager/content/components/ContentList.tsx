import type { ContentEntry } from '../types';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import SimpleMenu from '@/src/components/navigation/SimpleMenu';
import { useNavigate } from 'react-router';

interface ContentListProps {
  contentEntries: ContentEntry[];
  page?: number;
  perPage?: number;
}

export const ContentList = ({ contentEntries, page = 0, perPage = 20 } : ContentListProps) => {
  const { t } = useTranslation('common');
  const { currentOrganization } = useOrganizationContext('true');
  const navigate = useNavigate();

  const columns: GridColDef[] = useMemo(() => ([
    {
      field: 'id', 
      headerName: '-',
      renderCell: (params) => (
        <SimpleMenu buttonLabel="Actions">
          <MenuItem 
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/content/${params.value}`)}
          >
            {t('actions.manage', { ns: 'common' })}
          </MenuItem>
          <MenuItem 
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/content/edit/${params.value}`)}
          >
            {t('actions.edit', { ns: 'common' })}
          </MenuItem>
        </SimpleMenu>
      ),
    },
    { field: 'title', headerName: t('fields.title'), width: 180 },
    {
      field: 'status',
      headerName: t('fields.status'),
      with: 120,
      valueFormatter: (val) => (
        val === 'published' ? 'Published' : val === 'draft' ? 'Draft' : val
      ),
    },
    { 
      field: 'required_role', 
      headerName: t('fields.required_role'), 
      width: 120,
    },
    { 
      field: 'is_shared', 
      headerName: t('fields.is_shared'), 
      width: 120,
      valueFormatter: (val) => val ? t('yes') : t('no'), 
    },
    { 
      field: 'created_at', 
      headerName: t('fields.created_at'),
      width: 120,
      valueFormatter: (val) => val && new Date(val).toLocaleDateString(), 
    },
  ]), [t, currentOrganization, navigate]);

  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid 
        columns={columns}
        rows={contentEntries}
        initialState={{ 
          pagination: { 
            paginationModel: { 
              page, 
              pageSize: perPage, 
            },
          }, 
        }}
        showToolbar
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Paper>
  );
};