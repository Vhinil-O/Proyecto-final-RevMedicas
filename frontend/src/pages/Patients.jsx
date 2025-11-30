// src/pages/Patients.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function Patients() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // 1. Cargar pacientes al iniciar
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients/');
        setPatients(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPatients();
  }, []);

  // 2. Borrar paciente
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      try {
        await api.delete(`/patients/${id}`);
        setPatients(patients.filter(p => p.id_patient !== id));
      } catch (error) {
        console.log(error)
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="flex-grow-1 p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-secondary">Listado de Pacientes</h2>
          <button 
            onClick={() => navigate('/patients/create')} 
            className="btn btn-warning text-white fw-bold btn-lg rounded-pill shadow-sm"
          >
            + Nuevo Paciente
          </button>
        </div>

        <div className="row g-4">
          {patients.map((patient) => (
            <div key={patient.id_patient} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold shadow-sm"         
                    style={{width:'60px',height: '60px',minWidth: '60px',fontSize: '1.5rem'}}>
                      {patient.nombre.charAt(0).toUpperCase()}
                    </div>
                    <h5 className="card-title fw-bold mb-0">{patient.nombre}</h5>
                  </div>

                  <div className="mb-4">
                    <div className="text-muted small mb-1">📞 Teléfono:</div>
                    <div className="fw-medium">{patient.telefono}</div>
                    
                    <div className="text-muted small mt-2 mb-1">✉️ Email:</div>
                    <div className="fw-medium">{patient.email}</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => navigate(`/patients/edit/${patient.id_patient}`)}
                      className="btn btn-outline-primary btn-sm rounded-pill w-50"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(patient.id_patient)}
                      className="btn btn-outline-danger btn-sm rounded-pill w-50"
                    >
                      Eliminar
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
          
          {patients.length === 0 && (
            <div className="alert alert-warning text-center mt-4">
              No hay pacientes registrados aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Patients;