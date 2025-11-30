// src/pages/Appointments.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  
 
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // stado para la fecha del filtro (Por defecto: HOY)
  // new Date().toISOString().split('T')[0] nos da el formato "2023-11-28"
  
  const navigate = useNavigate();

  //Cargar datos dependiendo de la fecha
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pedimos doctores y pacientes 
        const [docRes, patRes] = await Promise.all([
          api.get('/doctors/'),
          api.get('/patients/')
        ]);
        setDoctors(docRes.data);
        setPatients(patRes.data);

        // Pedir citas FILTRADAS por la fecha seleccionada
        // Esto le manda al backend: GET /appointments/?fecha=2023-11-28
        const appRes = await api.get('/appointments/', {
          params: { fecha: selectedDate }
        });
        setAppointments(appRes.data);

      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    
    fetchData();
  }, [selectedDate]); // Se ejecuta cada vez que 'selectedDate' cambia

  // Auxiliares 
  const getDoctorName = (id) => {
    const doc = doctors.find(d => d.id_doctor === id);
    return doc ? doc.nombre : 'Desconocido';
  };

  const getPatientName = (id) => {
    const pat = patients.find(p => p.id_patient === id);
    return pat ? pat.nombre : 'Desconocido';
  };

  const formatDate = (dateString) => {
    // Solo mostramos la HORA porque la fecha ya la sabemos 
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Cancelar esta cita?")) {
      try {
        await api.delete(`/appointments/${id}`);
        setAppointments(appointments.filter(a => a.id_appointment !== id));
      } catch (error) {
        console.log(error)
        alert("Error al cancelar");
      }
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="flex-grow-1 p-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-secondary mb-1">Agenda Diaria</h2>
            <p className="text-muted">Gestiona las citas del día</p>
          </div>
          
          <div className="d-flex gap-3">
            {/* 4. NUEVO: Selector de Fecha */}
            <input 
              type="date" 
              className="form-control form-control-lg border-0 shadow-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            
            <button 
              onClick={() => navigate('/appointments/create')}
              className="btn btn-success text-white fw-bold btn-lg rounded-pill shadow-sm px-4"
            >
              + Nueva Cita
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="py-3 ps-4">Hora</th>
                  <th>Paciente</th>
                  <th>Doctor</th>
                  <th>Estado</th>
                  <th className="text-end pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id_appointment}>
                    <td className="ps-4 fw-bold text-primary fs-5">
                      {formatDate(appt.fecha)}
                    </td>
                    <td>
                      <div className="fw-bold">{getPatientName(appt.patient_id)}</div>
                      <div className="small text-muted">Paciente</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 text-info rounded-circle p-2 me-2 small fw-bold">
                          Dr
                        </div>
                        {getDoctorName(appt.doctor_id)}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-success bg-opacity-75 rounded-pill px-3">
                        {appt.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        onClick={() => handleDelete(appt.id_appointment)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}

                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <h5>No hay citas para este día 📅</h5>
                      <p className="small">Intenta seleccionar otra fecha o crea una nueva.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;