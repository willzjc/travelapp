import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Container, Typography, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, List,
  ListItem, ListItemText, Paper, Box, Tabs, Tab,
  AppBar, Toolbar, IconButton, Card, CardContent,
  Divider, ButtonGroup, Chip, Menu, MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapSidePane from '../components/MapSidePane';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const { getGroupById, addPerson, calculateDebts, deleteTransaction, deleteGroup, openMap, isMapOpen, mapLocation, closeMap } = useApp();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [openAddPerson, setOpenAddPerson] = useState(false);
  const [personName, setPersonName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [deleteGroupConfirmOpen, setDeleteGroupConfirmOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const group = groupId ? getGroupById(groupId) : undefined;
  const debts = groupId ? calculateDebts(groupId) : [];

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpenAddPerson = () => {
    setOpenAddPerson(true);
  };

  const handleCloseAddPerson = () => {
    setOpenAddPerson(false);
    setPersonName('');
  };

  const handleAddPerson = () => {
    if (personName.trim() && groupId) {
      addPerson(groupId, personName);
      handleCloseAddPerson();
    }
  };

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (groupId && transactionToDelete) {
      deleteTransaction(groupId, transactionToDelete);
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteGroupClick = () => {
    handleMenuClose();
    setDeleteGroupConfirmOpen(true);
  };

  const handleDeleteGroupConfirm = () => {
    if (groupId) {
      deleteGroup(groupId);
      setDeleteGroupConfirmOpen(false);
      navigate('/');
    }
  };

  const handleDeleteGroupCancel = () => {
    setDeleteGroupConfirmOpen(false);
  };

  if (!group) {
    return <Typography>Group not found!</Typography>;
  }

  const findPersonName = (id: string) => {
    const person = group.people.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {group.name}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDeleteGroupClick} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete Group
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="group tabs">
            <Tab label="Transactions" />
            <Tab label="People" />
            <Tab label="Summary" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Transactions
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/group/${groupId}/transaction/new`)}
            >
              Add Transaction
            </Button>
          </Box>

          {group.transactions.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No transactions yet. Add one to get started!
              </Typography>
            </Paper>
          ) : (
            <List>
              {group.transactions.map((transaction) => (
                <Card key={transaction.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{transaction.description}</Typography>
                    <Typography color="text.secondary">
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body1">
                        Paid by: {findPersonName(transaction.paidById)}
                      </Typography>
                      <Typography variant="h6">${transaction.amount.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Participants: {transaction.participants.map(id => findPersonName(id)).join(', ')}
                    </Typography>
                    
                    {transaction.location && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<LocationOnIcon />}
                          label={transaction.location}
                          onClick={() => openMap(transaction.location!)}
                          size="small"
                          sx={{ cursor: 'pointer' }}
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <ButtonGroup variant="outlined" size="small">
                        <Button 
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/group/${groupId}/transaction/${transaction.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          startIcon={<DeleteIcon />} 
                          color="error"
                          onClick={() => handleDeleteClick(transaction.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              People
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenAddPerson}
            >
              Add Person
            </Button>
          </Box>

          {group.people.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No people added yet. Add people to your group!
              </Typography>
            </Paper>
          ) : (
            <List>
              {group.people.map((person) => (
                <ListItem key={person.id} divider>
                  <ListItemText primary={person.name} />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography variant="h5" component="h2" gutterBottom>
            Summary
          </Typography>

          {debts.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No debts to settle. Add some transactions first!
              </Typography>
            </Paper>
          ) : (
            <List>
              {debts.map((debt, index) => (
                <ListItem key={index} divider>
                  <ListItemText 
                    primary={`${findPersonName(debt.fromPersonId)} owes ${findPersonName(debt.toPersonId)} $${debt.amount.toFixed(2)}`} 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </Container>

      {/* Add Person Dialog */}
      <Dialog open={openAddPerson} onClose={handleCloseAddPerson}>
        <DialogTitle>Add a Person</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Person Name"
            type="text"
            fullWidth
            variant="outlined"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPerson}>Cancel</Button>
          <Button onClick={handleAddPerson} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Transaction Confirmation Dialog */}
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
      
      {/* Delete Group Confirmation Dialog */}
      <Dialog
        open={deleteGroupConfirmOpen}
        onClose={handleDeleteGroupCancel}
      >
        <DialogTitle>Delete Group</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this entire group and all its transactions? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteGroupCancel}>Cancel</Button>
          <Button onClick={handleDeleteGroupConfirm} variant="contained" color="error">
            Delete Group
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Map Side Pane */}
      <MapSidePane 
        location={mapLocation}
        open={isMapOpen}
        onClose={closeMap}
      />
    </>
  );
}
