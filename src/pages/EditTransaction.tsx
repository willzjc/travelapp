import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Container, Typography, Button, TextField, FormControl,
  InputLabel, Select, MenuItem, FormGroup, FormControlLabel,
  Checkbox, Box, AppBar, Toolbar, IconButton, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditTransaction() {
  const { groupId, transactionId } = useParams<{ groupId: string, transactionId: string }>();
  const { getGroupById, getTransactionById, editTransaction } = useApp();
  const navigate = useNavigate();

  const group = groupId ? getGroupById(groupId) : undefined;
  const transaction = transactionId && groupId ? getTransactionById(groupId, transactionId) : undefined;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setPaidById(transaction.paidById);
      setParticipants(transaction.participants);
      setDate(transaction.date);
    }
  }, [transaction]);

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
      date
    });

    navigate(`/group/${groupId}`);
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
          </form>
        </Paper>
      </Container>
    </>
  );
}
