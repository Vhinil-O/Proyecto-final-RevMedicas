import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//importamos las paginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <Routes>
      {/* 1. Ruta del Login */}
      <Route path="/login" element={<Login />} />
      
      {/* 2. Ruta del Dashboard (¡Esta es la que te falta!) */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* 3. Redirección automática: Si entran a la raíz, mándalos al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;