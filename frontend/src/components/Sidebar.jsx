import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column p-3 bg-white shadow-sm" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="d-flex align-items-center mb-4 text-decoration-none">
        <span className="fs-4 fw-bold text-primary">🏥 RevMédicas</span>
      </div>
      
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link to="/dashboard" className="nav-link active d-flex align-items-center gap-2">
            <span>📊</span> Panel Principal
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/doctors" className="nav-link text-dark d-flex align-items-center gap-2 hover-bg-light">
            <span>👨‍⚕️</span> Doctores
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/patients" className="nav-link text-dark d-flex align-items-center gap-2">
            <span>🤒</span> Pacientes
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/appointments" className="nav-link text-dark d-flex align-items-center gap-2">
            <span>📅</span> Agenda
          </Link>
        </li>
      </ul>
      
      <hr />
      
      <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
        <span>🚪</span> Cerrar Sesión
      </button>
    </div>
  );
}

export default Sidebar;