import type { Tag } from '../types';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@mui/material';
import { useMemo } from 'react';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';
import SimpleMenu from '@/src/components/navigation/SimpleMenu';
import { useNavigate } from 'react-router';

interface TagListProps {
  tags: Tag[];
  page?: number;
  perPage?: number;
}

export const TagList = ({ tags, page = 0, perPage = 20 } : TagListProps) => {
  const { t } = useTranslation('components');
  const { currentOrganization } = useOrganizationContext('true');
  // const { breakpoints } = useTheme();
  // const isMediumWidthDevice = useMediaQuery(breakpoints.down('md'));
  const navigate = useNavigate();

  const columns: GridColDef[] = useMemo(() => ([    
    {
      field: 'id',
      headerName: '-',
      renderCell: (params) => (
        <SimpleMenu buttonLabel="Actions">
          <MenuItem 
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/tags/${params.value}`)}
          >
            {t('actions.manage', { ns: 'common' })}
          </MenuItem>
          <MenuItem 
            onClick={() => navigate(`/dashboard/${currentOrganization.id}/tags/edit/${params.value}`)}
          >
            {t('actions.edit', { ns: 'common' })}
          </MenuItem>
          <MenuItem 
            onClick={() => navigate(`/app/content/${params.value}?orgId=${currentOrganization.id}`)}
          >
            {t('tags.tag_list.view_client')}
          </MenuItem>
        </SimpleMenu>
      ),
    },
    { field: 'label', headerName: t('tags.form.label_input.label'), width: 180 },
    { field: 'address', headerName: t('tags.form.address_input.label'), width: 120 },
    { field: 'floor', headerName: t('tags.form.floor_input.label'), width: 120 },
    { 
      field: 'created_at', 
      headerName: t('fields.created_at', { ns: 'common' }),
      width: 120,
      valueFormatter: (val) => val && new Date(val).toLocaleDateString(), 
    },
  ]), [t, currentOrganization, navigate]);

  return (
    <Paper sx={{ width: '100%' }}>        
      <DataGrid 
        columns={columns}
        rows={tags}
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

      // { isMediumWidthDevice ? (
      //     <List>
      //       {tags.map((tag) => (
      //         <ListItem key={tag.id}>
      //           <ListItemIcon>
      //             <PersonIcon />
      //           </ListItemIcon>
      //           <ListItemText
      //             primary={tag.label}
      //           />
      //         </ListItem>
      //       ))}
      //     </List>
      //   ) 
      //   : 