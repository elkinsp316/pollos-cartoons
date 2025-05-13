import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple authentication - In a real app, this should be handled by a secure backend
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      onLogin();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <div className="login-header">
          <FaLock className="lock-icon" />
          <h2>Acceso Administrativo</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 