import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//importamos las paginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm'
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/create" element={<DoctorForm />} />
      <Route path="/doctors/edit/:id" element={<DoctorForm />} />

      <Route path="/patients" element={<Patients />} />
      <Route path="/patients/create" element={<PatientForm />} />
      <Route path="/patients/edit/:id" element={<PatientForm />} />

    </Routes>
  );
}

export default App;