// src/pages/Doctors.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  // Cargar doctores al iniciar
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors/');
        setDoctors(response.data);
      } catch (error) {
        console.error("Error al cargar doctores:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Función para eliminar
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar a este doctor?")) {
      try {
        await api.delete(`/doctors/${id}`);
        setDoctors(doctors.filter(doc => doc.id_doctor !== id));
      } catch (error) {
        alert("Error al eliminar");
        console.log(error)
      }
    }
  };

  // --- FUNCIÓN AUXILIAR (NUEVA) ---
  // Esta función toma el nombre "Juan Perez" y devuelve la letra "J"
  // Si no hay nombre, devuelve una carita.
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="flex-grow-1 p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-secondary">Directorio de Doctores</h2>
          <button className="btn btn-primary btn-lg rounded-pill shadow-sm">
            + Nuevo Doctor
          </button>
        </div>

        <div className="row g-4">
          {doctors.map((doc) => (
            <div key={doc.id_doctor} className="col-md-12 col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div className="row g-0 h-100">
                  
                  {/* --- CAMBIO AQUÍ: COLUMNA DEL AVATAR (IZQUIERDA) --- */}
                  <div className="col-4 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                    {/* En lugar de <img>, usamos un círculo dibujado con CSS */}
                    <div 
                      className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center shadow-sm fw-bold"
                      style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}
                    >
                      {/* Llamamos a la función para obtener la inicial */}
                      {getInitial(doc.nombre)}
                    </div>
                  </div>
                  
                  {/* COLUMNA DE INFORMACIÓN (DERECHA) */}
                  <div className="col-8">
                    <div className="card-body h-100 d-flex flex-column justify-content-center">
                      <h5 className="card-title fw-bold text-dark mb-1">
                        {doc.nombre}
                      </h5>
                      <p className="card-text text-muted mb-3">
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10">
                          {doc.especialidad}
                        </span>
                      </p>
                      
                      <div className="d-flex gap-2 mt-auto">
                        <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                          Ver Perfil
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id_doctor)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {doctors.length === 0 && (
            <div className="alert alert-info text-center mt-4">
              No hay doctores registrados. ¡Usa el botón para crear uno!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctors;