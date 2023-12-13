import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar'; // Corrected import path
import Client from './components/Client'; // Import your Clients component
import Accounts from './components/Account';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/client" element={<Client />} />
        <Route path="/accounts" element={<Accounts />} />

      </Routes>
    </Router>
  );
};

export default App;
