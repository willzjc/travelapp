import { Button, Typography, Box, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';

interface GoogleSignInProps {
  onSuccess?: () => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess }) => {
  const { signInWithGoogle, logout, isAuthenticated, user, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (isAuthenticated && user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'User'} 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%',
            }}
          />
        )}
        <Typography variant="body2">
          {user.displayName}
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Button 
      variant="contained" 
      startIcon={<GoogleIcon />}
      onClick={handleSignIn}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleSignIn;
