import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Container, Typography, Button, TextField, FormControl,
  InputLabel, Select, MenuItem, FormGroup, FormControlLabel,
  Checkbox, Box, AppBar, Toolbar, IconButton, Paper,
  CircularProgress, Snackbar, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCurrentLocation } from '../utils/location';

export default function EditTransaction() {
  const { groupId, transactionId } = useParams<{ groupId: string, transactionId: string }>();
  const { getGroupById, getTransactionById, editTransaction, deleteTransaction } = useApp();
  const navigate = useNavigate();

  const group = groupId ? getGroupById(groupId) : undefined;
  const transaction = transactionId && groupId ? getTransactionById(groupId, transactionId) : undefined;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setPaidById(transaction.paidById);
      setParticipants(transaction.participants);
      setDate(transaction.date);
      setLocation(transaction.location || '');
    }
  }, [transaction]);
  
  // Add ESC key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && groupId) {
        navigate(`/group/${groupId}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [groupId, navigate]);

  const handleParticipantToggle = (personId: string) => {
    setParticipants(prev => {
      if (prev.includes(personId)) {
        return prev.filter(id => id !== personId);
      } else {
        return [...prev, personId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !transactionId || !amount || !description || !paidById || participants.length === 0) {
      return;
    }

    editTransaction(groupId, transactionId, {
      description,
      amount: parseFloat(amount),
      paidById,
      participants,
      date,
      location: location || undefined
    });

    navigate(`/group/${groupId}`);
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const address = await getCurrentLocation();
      setLocation(address);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Failed to get location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (groupId && transactionId) {
      deleteTransaction(groupId, transactionId);
      setDeleteConfirmOpen(false);
      navigate(`/group/${groupId}`);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  if (!group || !transaction) {
    return <Typography>Transaction not found!</Typography>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(`/group/${groupId}`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Edit Transaction
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" gutterBottom>
              Edit Transaction
            </Typography>
            
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            
            <TextField
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <Typography>$</Typography>,
              }}
              required
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="paid-by-label">Paid By</InputLabel>
              <Select
                labelId="paid-by-label"
                value={paidById}
                label="Paid By"
                onChange={(e) => setPaidById(e.target.value)}
              >
                {group.people.map((person) => (
                  <MenuItem key={person.id} value={person.id}>
                    {person.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Date"
              type="date"
              fullWidth
              margin="normal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            
            <TextField
              label="Location (optional)"
              fullWidth
              margin="normal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Sydney Opera House, Australia"
              helperText="Location will be shown on Google Maps when clicked"
            />

            <Box sx={{ mt: 1, mb: 2 }}>
              <Button
                onClick={handleGetCurrentLocation}
                disabled={isLoadingLocation}
                startIcon={isLoadingLocation ? <CircularProgress size={20} /> : <LocationOnIcon />}
                variant="outlined"
                fullWidth
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '48px'
                }}
              >
                {isLoadingLocation ? 'Getting Location...' : 'Use My Current Location'}
              </Button>
            </Box>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Participants
            </Typography>
            <FormGroup>
              {group.people.map((person) => (
                <FormControlLabel
                  key={person.id}
                  control={
                    <Checkbox
                      checked={participants.includes(person.id)}
                      onChange={() => handleParticipantToggle(person.id)}
                    />
                  }
                  label={person.name}
                />
              ))}
            </FormGroup>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{ minHeight: '42px' }}
              >
                Delete Transaction
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  component={Link} 
                  to={`/group/${groupId}`} 
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
      
      <Snackbar 
        open={locationError !== null} 
        autoHideDuration={6000} 
        onClose={() => setLocationError(null)}
      >
        <Alert onClose={() => setLocationError(null)} severity="error">
          {locationError}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this transaction? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
