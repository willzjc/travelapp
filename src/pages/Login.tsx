import { useEffect } from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleSignIn from '../components/GoogleSignIn';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLoginSuccess = () => {
    navigate('/');
  };
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign in to travelapp
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Sign in with Google to track your expenses and sync your data across devices.
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <GoogleSignIn onSuccess={handleLoginSuccess} />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
