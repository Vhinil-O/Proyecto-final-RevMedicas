// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function Dashboard() {
  // Estado para guardar los números reales
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {// Cargar datos al iniciar
    const fetchData = async () => {
      try {
        
        const [docsRes, ptsRes, apptsRes] = await Promise.all([ // Pedimos los datos al backend de python
          api.get('/doctors/'),
          api.get('/patients/'),
          api.get('/appointments/')
        ]);

        setStats({
          doctors: docsRes.data.length,
          patients: ptsRes.data.length,
          appointments: apptsRes.data.length
        });
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      {/* 1. Menú Lateral */}
      <Sidebar />

      {/* 2. Área de Contenido */}
      <div className="flex-grow-1 p-5">
        <h2 className="fw-bold mb-4 text-secondary">Bienvenido al Panel de Control</h2>

        {/* Tarjetas de Resumen */}
        <div className="row g-4 mb-5">
          {/* Tarjeta 1: Citas */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <span className="fs-4">📅</span>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted mb-1">Citas Agendadas</h6>
                  <h2 className="card-title mb-0 fw-bold text-primary">
                    {loading ? "..." : stats.appointments}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Doctores */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <span className="fs-4">👨‍⚕️</span>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted mb-1">Doctores Activos</h6>
                  <h2 className="card-title mb-0 fw-bold text-success">
                    {loading ? "..." : stats.doctors}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Pacientes */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                  <span className="fs-4">wj</span>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted mb-1">Pacientes Registrados</h6>
                  <h2 className="card-title mb-0 fw-bold text-dark">
                    {loading ? "..." : stats.patients}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de "Próximas Acciones" */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold text-secondary">Acciones Rápidas</h5>
          </div>
          <div className="card-body p-4 text-center">
            <p className="text-muted mb-4">Selecciona una opción del menú lateral para comenzar a gestionar tu clínica.</p>
            <button className="btn btn-primary px-4 py-2 fw-bold rounded-pill">
              + Nueva Cita (Próximamente)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;