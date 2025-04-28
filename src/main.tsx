import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Uncomment this line to clear localStorage and force fresh demo data
// localStorage.removeItem('groups');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
