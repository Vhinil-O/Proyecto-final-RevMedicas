import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


const MEDICAL_IMAGE_URL = "https://dev.lemoius.com/assets/images/auth/Doctor-Login.png";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // Preparamos los datos como los pide OAuth2 (form-data)
      const formData = new FormData();
      formData.append('username', email); // el backend espera username aunque sea email
      formData.append('password', password);

      const response = await api.post('/token', formData);

    
      const token = response.data.access_token;   // Guardamos el token y redirigimos
      localStorage.setItem('token', token);
      
      console.log("Login correcto, token guardado.");
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        
        {/* COLUMNA IZQUIERDA: Imagen decorativa (Se oculta en celulares 'd-none d-md-block') */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img 
            src={MEDICAL_IMAGE_URL} 
            alt="Login Médico" 
            style={{ width: '100%', height: '100%', objectFit: 'cover',objectPosition: 'center' }}
          />
        </div>

        {/* COLUMNA DERECHA: Formulario */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <div style={{ maxWidth: '400px', width: '100%' }} className="p-4">
            
            {/* Icono o Logo Simulado */}
            <div className="text-center mb-4">
              <div className="bg-primary text-white d-inline-flex justify-content-center align-items-center rounded-circle" style={{width: '60px', height: '60px', fontSize: '24px'}}>
                +
              </div>
              <h2 className="mt-3 fw-bold">Bienvenido Doctor</h2>
              <p className="text-muted">Sistema de Gestión de Citas</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">CORREO ELECTRÓNICO</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-white border-0 shadow-sm"
                  placeholder="ejemplo@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">CONTRASEÑA</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-white border-0 shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
                Ingresar al Sistema
              </button>
            </form>

            <div className="text-center mt-4 text-muted small">
              ¿Olvidaste tu contraseña? Contacta al administrador.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;