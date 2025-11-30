// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // 👈 Importamos tu Login

function App() {
  return (
    <Routes>
      {/* Ruta para el Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Redirección automática: Si entran a "/", los manda a "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Aquí agregaremos la ruta /dashboard más adelante */}
    </Routes>
  );
}

export default App;