import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getCurrentLocation } from '../utils/location';

export default function NewTransaction() {
  const { groupId } = useParams<{ groupId: string }>();
  const { getGroupById, addTransaction } = useApp();
  const navigate = useNavigate();

  const group = groupId ? getGroupById(groupId) : undefined;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const now = new Date();
  const initialDateTime = `${now.toISOString().split('T')[0]}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const [date, setDate] = useState(initialDateTime);
  const [location, setLocation] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleParticipantToggle = (personId: string) => {
    setParticipants((prev) => {
      if (prev.includes(personId)) {
        return prev.filter((id) => id !== personId);
      } else {
        return [...prev, personId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !amount || !description || !paidById || participants.length === 0) {
      return;
    }

    addTransaction(groupId, {
      description,
      amount: parseFloat(amount),
      paidById,
      participants,
      date,
      location: location || undefined,
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

  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(`/group/${groupId}`);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscKey);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [groupId, navigate]);

  if (!group) {
    return <Typography>Group not found!</Typography>;
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
            New Transaction
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" gutterBottom>
              Add a New Transaction
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
              label="Date and Time"
              type="datetime-local"
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
                  height: '48px',
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

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button component={Link} to={`/group/${groupId}`} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Add Transaction
              </Button>
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
    </>
  );
}
