import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/Home';
import GroupDetail from './pages/GroupDetail';
import NewTransaction from './pages/NewTransaction';
import EditTransaction from './pages/EditTransaction';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupId" element={<GroupDetail />} />
            <Route path="/group/:groupId/transaction/new" element={<NewTransaction />} />
            <Route path="/group/:groupId/transaction/:transactionId/edit" element={<EditTransaction />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
 