import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

function AppointmentForm() {
  const navigate = useNavigate();

  // Estados para los datos del formulario
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [fecha, setFecha] = useState('');

  // Estados ppara las citas desplegables
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Cargar listas al inicar
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Pedimos ambas listas al mismo tiempo
        const [docRes, patRes] = await Promise.all([
          api.get('/doctors/'),
          api.get('/patients/')
        ]);
        setDoctors(docRes.data);
        setPatients(patRes.data);
      } catch (error) {
        console.error("Error cargando listas:", error);
        alert("Error cargando la lista de doctores o pacientes");
      }
    };
    fetchResources();
  }, []);

  
  const handleSubmit = async (e) => {// Se envia el formulario
    e.preventDefault();

    // Validación básica
    if (!doctorId || !patientId || !fecha) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      // Enviamos al Backend
      await api.post('/appointments/', {
        doctor_id: parseInt(doctorId),   // Convertimos a número entero
        patient_id: parseInt(patientId), // Convertimos a número entero
        fecha: fecha,                    // El formato de datetime-local es compatible (YYYY-MM-DDTHH:mm)
        status: "Agendada"               // Valor por defecto
      });

      alert("¡Cita agendada con éxito!");
      navigate('/appointments'); // Regresamos a la agenda

    } catch (error) {
      console.error(error);
     
      if (error.response && error.response.data && error.response.data.detail) {  // Si el backend dice "Horario ocupado"  mostramos el mensaje
        alert("Error: " + error.response.data.detail); 
      } else {
        alert("Ocurrió un error al agendar la cita.");
      }
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="flex-grow-1 p-5">
        <h2 className="fw-bold text-secondary mb-4">Agendar Nueva Cita</h2>

        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            
            {/* SELECCIONAR PACIENTE */}
            <div className="mb-3">
              <label className="form-label fw-bold text-muted">Paciente</label>
              <select 
                className="form-select form-select-lg bg-light border-0"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                <option value="">Selecciona un paciente...</option>
                {patients.map(p => (
                  <option key={p.id_patient} value={p.id_patient}>
                    {p.nombre} (Tel: {p.telefono})
                  </option>
                ))}
              </select>
            </div>

            {/* SELECCIONAR DOCTOR */}
            <div className="mb-3">
              <label className="form-label fw-bold text-muted">Doctor</label>
              <select 
                className="form-select form-select-lg bg-light border-0"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
              >
                <option value="">Selecciona un doctor...</option>
                {doctors.map(d => (
                  <option key={d.id_doctor} value={d.id_doctor}>
                    {d.nombre} - {d.especialidad}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECCIONAR FECHA Y HORA */}
            <div className="mb-4">
              <label className="form-label fw-bold text-muted">Fecha y Hora</label>
                <input 
                    type="datetime-local" 
                    className="form-control form-control-lg bg-light border-0"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    // Mínimo: La fecha y hora actual (para bloquear el pasado)
                    min={new Date().toISOString().split('T')[0] + "T00:00"} 
                    //1800 segundos = 30 minutos (para que el reloj sugiera :00 y :30)
                    step="1800"
                />
                <div className="form-text">Horarios en intervalos de 30 minutos.</div>
            </div>

            {/* BOTONES */}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success text-white fw-bold btn-lg rounded-pill px-4">
                Confirmar Cita
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                onClick={() => navigate('/appointments')}
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

export default AppointmentForm;