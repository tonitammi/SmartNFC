import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from 'react-router';
import { forwardRef } from 'react';

const isExternalUrl = (url: string): boolean => {
  return /^(https?:?\/?\/?|mailto:|tel:)/.test(url);
};

/** Adds react-router Link component behavior to Material UI Link component */
export const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  if (typeof href === 'string' && isExternalUrl(href)) {
    return (
      <a 
        ref={ref} 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        {...other} 
      />
    );
  }
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});
