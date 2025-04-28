import { HashRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import GroupDetail from './pages/GroupDetail';
import NewTransaction from './pages/NewTransaction';
import EditTransaction from './pages/EditTransaction';
import MapSidePane from './components/MapSidePane';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Wrapper component for MapSidePane
function MapContainer() {
  const { location } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  
  const handleClose = () => {
    setOpen(false);
    navigate(-1); // Go back when the map is closed
  };

  return (
    <MapSidePane 
      location={location || ''} 
      open={open} 
      onClose={handleClose} 
    />
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        {/* Using HashRouter for GitHub Pages compatibility */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupId" element={<GroupDetail />} />
            <Route path="/group/:groupId/transaction/new" element={<NewTransaction />} />
            <Route path="/group/:groupId/transaction/:transactionId/edit" element={<EditTransaction />} />
            <Route path="/map/:location" element={<MapContainer />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
