import { useState } from 'react';
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  Box 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  showSignInButton?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ showSignInButton = true }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
  };
  
  const handleViewProfile = () => {
    navigate('/profile');
    handleClose();
  };
  
  const handleSignIn = () => {
    navigate('/login');
  };
  
  if (!isAuthenticated) {
    return showSignInButton ? (
      <Box>
        <IconButton color="inherit" onClick={handleSignIn}>
          <AccountCircleIcon />
        </IconButton>
      </Box>
    ) : null;
  }
  
  return (
    <Box>
      <IconButton 
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
      >
        {user?.photoURL ? (
          <Avatar 
            src={user.photoURL} 
            alt={user.displayName || 'User'} 
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <Avatar>{user?.displayName?.[0] || 'U'}</Avatar>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">{user?.displayName}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleViewProfile}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
