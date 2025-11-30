import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//importamos las paginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Doctors from './pages/Doctors';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/doctors" element={<Doctors />} />
    </Routes>
  );
}

export default App;