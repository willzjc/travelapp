import { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { groups } = useApp();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate('/')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
            <Avatar 
              src={user.photoURL || undefined} 
              alt={user.displayName || 'User'}
              sx={{ width: 80, height: 80, mr: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 0 } }}
            />
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" component="h1" gutterBottom>
                {user.displayName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ mt: { xs: 2, sm: 0 } }}
            >
              Sign Out
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Your Activity
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Groups" 
                secondary={`You are participating in ${groups.length} groups`} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="User ID" 
                secondary={user.uid} 
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;
