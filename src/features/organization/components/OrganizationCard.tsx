import { Card, CardActionArea, CardContent, Chip, Link, Stack, Tooltip, Typography } from '@mui/material';
import type { UserOrganization } from '../types';
import type { OrganizationUserRole } from '../../organization-users/types';
import { useOrganizationContext } from '../context/useOrganizationContext';
import { useOrganizationsUsersCount } from '../../organization-users/hooks/useOrganizationUsersCount';
import { useTranslation } from 'react-i18next';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import { DateFormat } from '@/src/components/utils/formatting/DateFormat';

type ChipColor = 'primary' | 'secondary' | 'default';
export interface OrganizationCardProps {
  organization: UserOrganization;
};

export const OrganizationCard = ({ organization } : OrganizationCardProps) => {
  const { 
    id: orgId, 
    name, 
    created_at: createdAt,
    user_role: userRole, 
  } = organization;
  const { setCurrentOrganization } = useOrganizationContext();
  const { data } = useOrganizationsUsersCount({ orgId });
  const { t } = useTranslation('common');

  const getChipColor = (role: OrganizationUserRole): ChipColor => {
    const colors: Record<string, ChipColor> = {
      'owner': 'primary',
      'admin': 'primary',
      'editor': 'secondary',
      'user': 'default',
    };

    return colors[role];
  };
  return (
    <Card elevation={1} sx={{ width: 280, textAlign: 'left' }}>
      <Tooltip title={`Click to select organization ${name}`}>
        <CardActionArea 
          LinkComponent={Link} 
          href={`/dashboard/${orgId}`}
          onClick={() => setCurrentOrganization(orgId)}
        >
          <CardContent>
            <Typography gutterBottom variant="subtitle2">{name}</Typography>
            
            <Typography 
              gutterBottom 
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              Created at: <DateFormat date={createdAt} format="localDate" />
            </Typography>

            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{ 
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px', 
                }}
                
              >
                <GroupIcon fontSize="inherit" />
                {t('members')} {data?.count}
              </Typography>
              <Chip 
                label={`Role: ${userRole}`} 
                size="small"
                sx={{ marginTop: '1rem' }} 
                color={getChipColor(userRole)}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Tooltip>
    </Card>
  );
};