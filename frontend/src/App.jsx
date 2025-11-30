import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//importamos las paginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm'

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/doctors" element={<Doctors />} />

      <Route path="/doctors/create" element={<DoctorForm />} />
      <Route path="/doctors/edit/:id" element={<DoctorForm />} />

    </Routes>
  );
}

export default App;