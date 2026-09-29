import { useState, type ReactNode, type MouseEvent } from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { IconButton, type IconButtonProps } from '@mui/material';

export interface SimpleMenuProps {
  useIconBtn?: boolean;
  buttonLabel?: string | ReactNode;
  children: ReactNode | ReactNode[];
}

export default function SimpleMenu({ 
  useIconBtn = false,
  buttonLabel = '', 
  children,
} : SimpleMenuProps) {
  const [ id ] = useState<string>(crypto.randomUUID());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = !!anchorEl;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const buttonAttributes: Partial<ButtonProps & IconButtonProps>= {
    id: `simple-menu-button-${id}`,
    ['aria-controls']: isOpen ? `simple-menu-${id}` : undefined,
    ['aria-haspopup']: 'true',
    ['aria-expanded']: isOpen ? 'true' : undefined,
    onClick: handleClick,
  };

  return (
    <div>
      { useIconBtn ? (
        <IconButton {...buttonAttributes}>
          { buttonLabel }
        </IconButton>
      ) : (
        <Button {...buttonAttributes}>
          { buttonLabel }
        </Button>
      )}

      <Menu
        id={`simple-menu-${id}`}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': `simple-menu-button-${id}`,
          },
        }}
      >
        { children }
      </Menu>
    </div>
  );
}