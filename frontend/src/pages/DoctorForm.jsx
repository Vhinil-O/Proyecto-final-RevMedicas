import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function DoctorForm() {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams(); // Capturamos el ID de la URL (si existe)

 
  useEffect(() => {
    const loadDoctor = async () => {
      if (id) { // Si hay un ID, cargamos los datos del doctor
        try {
          
          const response = await api.get(`/doctors/${id}`);// Petición GET para traer los datos actuales del doctor
          setNombre(response.data.nombre);
          setEspecialidad(response.data.especialidad);
        } catch (error) {
          console.error(error);
          alert("Error al cargar el doctor");
        }
      }
    };
    loadDoctor();
  }, [id]); // Se ejecuta si cambia el ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {//Si hay un id entramos en un modo de edicion
        
        await api.put(`/doctors/${id}`, {
          nombre: nombre,
          especialidad: especialidad
        });
        alert('¡Doctor actualizado correctamente!');
      } else {//Si no, en un modo de creacion
        
        await api.post('/doctors/', {
          nombre: nombre,
          especialidad: especialidad
        });
        alert('¡Doctor registrado con éxito!');
      }
      navigate('/doctors');
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="flex-grow-1 p-5">
        {/* Título dinámico: Cambia según si estamos editando o creando */}
        <h2 className="fw-bold text-secondary mb-4">
          {id ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
        </h2>

        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label fw-bold text-muted">Nombre Completo</label>
              <input 
                type="text" 
                className="form-control form-control-lg bg-light border-0"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-muted">Especialidad</label>
              <select 
                className="form-select form-select-lg bg-light border-0"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                required
              >
                <option value="">Selecciona una opción...</option>
                <option value="Cardiología">Cardiología</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Medicina General">Medicina General</option>
                <option value="Neurología">Neurología</option>
                <option value="Dermatología">Dermatología</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary btn-lg rounded-pill px-4">
                {id ? 'Guardar Cambios' : 'Guardar Doctor'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                onClick={() => navigate('/doctors')}
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorForm;