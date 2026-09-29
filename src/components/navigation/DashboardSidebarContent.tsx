import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { Link, useLocation, useParams } from 'react-router';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import DashboardIcon from '@mui/icons-material/Dashboard';
import type { ReactNode } from 'react';
import type { PropsOf } from '@emotion/react';
import { FolderShared, Nfc, PermMedia, SensorsRounded } from '@mui/icons-material';

export interface DashboardSidebarContentProps extends PropsOf<typeof Box> {
  onLinkClick?: () => void;
};

export const DashboardSidebarContent = ({ onLinkClick = () => {}, ...restProps }: DashboardSidebarContentProps) => {
  const { pathname } = useLocation();
  const { orgId } = useParams();

  if (!orgId) return (
    <Box p={2} {...restProps}>
      {/* <Typography>Valitse organisaatio</Typography>
      <OrganizationSelect /> */}
    </Box>
  );

  return (
    <Box {...restProps}>
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to={`/dashboard/${orgId}`} 
            selected={pathname === `/dashboard/${orgId}`}
            onClick={onLinkClick}
          >
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      
      {/* Main categories */}
      <List>
        
        <SidebarCategory 
          label="Tags" 
          icon={<Nfc />} 
          basePath={`/dashboard/${orgId}/tags`}
          active={pathname.includes('tags')}
          subItems={[
            { label: 'Browse tags', path: '' },
            { label: 'Create tag', path: '/create' },
          ]}
          onLinkClick={onLinkClick}
        />

        <SidebarCategory 
          label="Content" 
          icon={<DescriptionIcon />} 
          basePath={`/dashboard/${orgId}/content`}
          active={pathname.includes('content')}
          subItems={[
            { label: 'Browse content', path: '' },
            { label: 'Create content entry', path: '/create' },
          ]}
          onLinkClick={onLinkClick}
        />

        <SidebarCategory 
          label="NFC Tools" 
          icon={<SensorsRounded />} 
          basePath={`/dashboard/${orgId}/nfc`}
          active={pathname.includes('nfc')}
          subItems={[
            { label: 'Tools', path: '' },
            { label: 'Scan', path: '/scan' },
          ]}
          onLinkClick={onLinkClick}
        />

        <SidebarCategory 
          label="Users" 
          icon={<PeopleIcon />} 
          basePath={`/dashboard/${orgId}/users`}
          active={pathname.includes('users')}
          subItems={[
            { label: 'Browse users', path: '' },
            { label: 'Invitations', path: '/invitations' },
            { label: 'Invite user', path: '/invite' },
          ]}
          onLinkClick={onLinkClick}
        />

        <SidebarCategory 
          label="Media" 
          icon={<PermMedia />} 
          basePath={`/dashboard/${orgId}/media`}
          active={pathname.includes('media')}
          subItems={[
            { label: 'Browse Media', path: '' },
          ]}
          onLinkClick={onLinkClick}
        />

        
        <SidebarCategory 
          label="Shared assets" 
          icon={<FolderShared />} 
          basePath={`/dashboard/${orgId}/not-implemented`}
          active={pathname.includes('shared-assets')}
          subItems={[
            { label: 'Browse assets', path: '' },
          ]}
          onLinkClick={onLinkClick}
        />
      </List>
    </Box>
  );
};

type SidebarCategoryProps = {
  label: string;
  icon: ReactNode;
  basePath: string;
  active: boolean;
  subItems: { label: string, path: string }[];
  onLinkClick?: () => void;
}

const SidebarCategory = ({ label, icon, basePath, active, subItems, onLinkClick = () => {} }: SidebarCategoryProps) => (
  <>
    <ListItem disablePadding>
      <ListItemButton 
        component={Link} 
        to={basePath} 
        sx={{ 
          fontWeight: active ? 'bold' : 'normal', 
          color: active ? 'primary.main' : 'inherit', 
        }}
        onClick={onLinkClick}
      >
        <ListItemIcon sx={{ color: active ? 'primary.main' : 'inherit' }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>

    {active && subItems.map((item, i) => (
      <ListItem key={item.label + i} disablePadding>
        <ListItemButton
          component={Link} 
          to={`${basePath}${item.path}`} 
          sx={{ pl: 9 }}
          onClick={onLinkClick}
        >
          <ListItemText secondary={item.label} />
        </ListItemButton>
      </ListItem>
    ))}
  </>
);