// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? "nav-link active d-flex align-items-center gap-2 bg-primary text-white fw-bold shadow-sm" 
      : "nav-link d-flex align-items-center gap-2 text-dark hover-bg-light";
  };

  return (
    <div className="d-flex flex-column p-3 bg-white text-dark border-end" style={{ width: '250px', minHeight: '100vh' }}>
      
      <div className="d-flex align-items-center mb-4 px-2 text-decoration-none">
        <span className="fs-4 fw-bold text-primary">🏥 RevMédicas</span>
      </div>
      
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <span>📊</span> Panel Principal
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/doctors" className={isActive('/doctors')}>
            <span>👨‍⚕️</span> Doctores
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/patients" className={isActive('/patients')}>
            <span>🤒</span> Pacientes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/appointments" className={isActive('/appointments')}>
            <span>📅</span> Agenda
          </Link>
        </li>
      </ul>
      
      <hr />
      
      <div className="dropdown">
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;