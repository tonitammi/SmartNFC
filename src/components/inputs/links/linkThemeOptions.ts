import type { LinkProps } from '@mui/material/Link';
import { LinkBehavior } from './LinkBehavior';

/** ThemeOptions to add react-router Link component behavior to Material UI Link component */
export const linkThemeOptions = {
  MuiLink: {
    defaultProps: {
      component: LinkBehavior,
    } as LinkProps,
  },
  MuiButtonBase: {
    defaultProps: {
      LinkComponent: LinkBehavior,
    },
  },
};