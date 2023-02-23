import React from 'react';
import AuthContextPovider from './context/AuthContext';
import './App.scss';
import Routes from './pages/Routes'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'

function App() {
  return (
    <AuthContextPovider>
      <Routes />
    </AuthContextPovider>
  );
}

export default App;
