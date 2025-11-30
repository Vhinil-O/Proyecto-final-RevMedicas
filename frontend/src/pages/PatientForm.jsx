// src/pages/PatientForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function PatientForm() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams(); 

  // Si es editar, cargamos los datos
  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        try {
          const response = await api.get(`/patients/${id}`);
          setNombre(response.data.nombre);
          setTelefono(response.data.telefono);
          setEmail(response.data.email);
        } catch (error) {
          console.log(error)
          alert("Error al cargar paciente");
        }
      }
    };
    loadPatient();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { nombre, telefono, email };

    try {
      if (id) {
        await api.put(`/patients/${id}`, data);
        alert('Paciente actualizado');
      } else {
        await api.post('/patients/', data);
        alert('Paciente registrado');
      }
      navigate('/patients');
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-5">
        <h2 className="fw-bold text-secondary mb-4">
          {id ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
        </h2>

        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label fw-bold text-muted">Nombre Completo</label>
              <input 
                type="text" 
                className="form-control bg-light border-0"
                value={nombre} onChange={(e) => setNombre(e.target.value)} required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-muted">Teléfono</label>
              <input 
                type="tel" 
                className="form-control bg-light border-0"
                value={telefono} onChange={(e) => setTelefono(e.target.value)} required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-muted">Correo Electrónico</label>
              <input 
                type="email" 
                className="form-control bg-light border-0"
                value={email} onChange={(e) => setEmail(e.target.value)} required 
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-warning text-white fw-bold btn-lg rounded-pill px-4">
                Guardar
              </button>
              <button type="button" className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                onClick={() => navigate('/patients')}>
                Cancelar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientForm;