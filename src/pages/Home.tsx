import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Container, Typography, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, List,
  ListItem, ListItemText, Paper, Box, AppBar, Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaidIcon from '@mui/icons-material/Paid';

export default function Home() {
  const { groups, addGroup } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setGroupName('');
  };

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      const newGroupId = addGroup(groupName);
      handleClose();
      navigate(`/group/${newGroupId}`);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <PaidIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            travelapp
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Your Trip Groups
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            New Group
          </Button>
        </Box>

        {groups.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              You haven't created any groups yet. Create a group to get started!
            </Typography>
          </Paper>
        ) : (
          <Paper>
            <List>
              {groups.map((group) => (
                <ListItem
                  button
                  key={group.id}
                  onClick={() => navigate(`/group/${group.id}`)}
                  divider
                >
                  <ListItemText
                    primary={group.name}
                    secondary={`${group.people.length} people · ${group.transactions.length} transactions`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Group Name (e.g., Summer Vacation 2023)"
              type="text"
              fullWidth
              variant="outlined"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreateGroup} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
