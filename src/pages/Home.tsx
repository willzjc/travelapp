import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  ListItemSecondaryAction,
  SpeedDial,
  SpeedDialIcon,
  Button,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import DeleteIcon from '@mui/icons-material/Delete';
import UserMenu from '../components/UserMenu';
import GoogleSignIn from '../components/GoogleSignIn';

export default function Home() {
  const { groups, addGroup, deleteGroup } = useApp();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const handleOpen = () => {
    // If not authenticated, prompt to log in first
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
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

  const handleDeleteClick = (event: React.MouseEvent, groupId: string) => {
    event.stopPropagation();
    setGroupToDelete(groupId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (groupToDelete) {
      deleteGroup(groupToDelete);
      setDeleteConfirmOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setGroupToDelete(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <PaidIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            travelapp
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {!isAuthenticated && (
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Welcome to travelapp!
            </Typography>
            <Typography variant="body1" paragraph>
              Sign in with Google to sync your trips across devices.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <GoogleSignIn />
            </Box>
          </Paper>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Your Trip Groups
          </Typography>
          {isAuthenticated && (
            <Typography variant="subtitle1">
              Signed in as {user?.displayName}
            </Typography>
          )}
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
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeleteClick(e, group.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        <SpeedDial
          ariaLabel="Create new group"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={handleOpen}
        />

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

        <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Delete Group</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this group and all its transactions? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
