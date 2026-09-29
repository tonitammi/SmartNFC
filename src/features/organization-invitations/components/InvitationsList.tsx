import type { OrganizationInvitation } from '../types';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemIcon, ListItemText, MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useCallback, useMemo } from 'react';
import { Capitalized } from '@/src/components/utils/formatting/Capitalized';
import { DateFormat } from '@/src/components/utils/formatting/DateFormat';
import SimpleMenu from '@/src/components/navigation/SimpleMenu';
import { useFeedback } from '@/src/hooks/useFeedback';
import { getInviteURL } from '../utils';
import { useOrganizationContext } from '../../organization/context/useOrganizationContext';
import { useInvitationMutations } from '../hooks/useInvitationMutations';

interface InvitationsListProps {
  invitations: OrganizationInvitation[];
  page?: number;
  perPage?: number;
}

export const InvitationsList = ({ invitations, page = 0, perPage = 20 } : InvitationsListProps) => {
  const { t } = useTranslation('common');
  const { organizations, currentOrganization } = useOrganizationContext('true');
  const { createSnackbar } = useFeedback();
  const { breakpoints } = useTheme();
  const { deleteMutation } = useInvitationMutations({
    orgId: currentOrganization.id,
  });
  const isMediumWidthDevice = useMediaQuery(breakpoints.down('md'));

  const getInvitationParams = useCallback((invitationId: string) => {
    const invitation = invitations.find((x) => x.id === invitationId)!;
    const { 
      email = '', 
      inviter_email: inviterEmail = '',
      org_id: orgId, 
    } = invitation; 
    const orgName = organizations.find((x) => x.id === orgId)?.name || '';

    return { 
      id: invitationId, 
      email, 
      inviterEmail, 
      orgName,
    };
  }, [invitations, organizations]);

  const copyInvitationUrl = useCallback(async (invitationId: string) => {
    const { id, email, inviterEmail, orgName } = getInvitationParams(invitationId);
    const type = 'text/plain';
    const clipboardItem = new ClipboardItem({
      [type]: getInviteURL(id, { 
        email,
        inviterEmail,
        orgName,
      }), 
    });
    await navigator.clipboard.write([clipboardItem]);
    
    createSnackbar({
      severity: 'success',
      content: 'Invitation link copied',
    });
  }, [createSnackbar, getInvitationParams]);

  const columns: GridColDef[] = useMemo(() => ([
    { field: 'email', headerName: t('fields.email'), width: 180 },
    { field: 'role', headerName: t('fields.role'), width: 120 },
    { field: 'status', headerName: t('fields.status'), width: 120 },
    { 
      field: 'created_at', 
      headerName: t('fields.created_at'),
      width: 120,
      valueFormatter: (val) => val && new Date(val).toLocaleDateString(), 
    },
    { 
      field: 'expires_at', 
      headerName: t('fields.expires_at'),
      width: 120,
      valueFormatter: (val) => val && new Date(val).toLocaleDateString(), 
    },
    {
      field: 'id',
      headerName: '-',
      renderCell: (params) => (
        <SimpleMenu buttonLabel="Actions">
          <MenuItem 
            onClick={() => copyInvitationUrl(params.value)}
          >
            {t('organizations.invitations.copy_invitation_link', { ns: 'components' })}
          </MenuItem>
          <MenuItem 
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(params.value)}
          >
            {
              deleteMutation.isPending ? 
              t('actions.canceling')
              :
              t('organizations.invitations.cancel_invitation', { ns: 'components' })
            }
            
          </MenuItem>
        </SimpleMenu>
      )},
  ]), [t, copyInvitationUrl, deleteMutation]);

  return (
    <Paper sx={{ width: '100%' }}>
      { isMediumWidthDevice ? (
          <List>
            {invitations.map((invitation) => (
              <ListItem key={invitation.id}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                
                <ListItemText
                  primary={invitation.email}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {t('fields.role')}: <Capitalized text={invitation.role} />
                        <br />
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {t('fields.created_at')}: <DateFormat date={invitation.created_at} format="localDate" /> 
                        <br />
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) 
        : 
        (
          <DataGrid 
            columns={columns}
            rows={invitations}
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
        ) 
    
      }
    </Paper>
  );
};