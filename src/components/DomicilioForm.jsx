import React, { useState } from 'react';
import './DomicilioForm.css';

function DomicilioForm({ onSubmit, total }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    barrio: '',
    referencias: '',
    metodoPago: 'efectivo',
    cambio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="domicilio-form">
      <h2>Información de Entrega</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre completo *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono *</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder="Ej: 3001234567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección *</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            placeholder="Ej: Calle 123 # 45-67"
          />
        </div>

        <div className="form-group">
          <label htmlFor="barrio">Barrio *</label>
          <input
            type="text"
            id="barrio"
            name="barrio"
            value={formData.barrio}
            onChange={handleChange}
            required
            placeholder="Ej: San Francisco"
          />
        </div>

        <div className="form-group">
          <label htmlFor="referencias">Referencias o indicaciones adicionales</label>
          <textarea
            id="referencias"
            name="referencias"
            value={formData.referencias}
            onChange={handleChange}
            placeholder="Ej: Casa azul, cerca al parque"
          />
        </div>

        <div className="form-group">
          <label htmlFor="metodoPago">Método de pago *</label>
          <select
            id="metodoPago"
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            required
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        {formData.metodoPago === 'efectivo' && (
          <div className="form-group">
            <label htmlFor="cambio">¿Para cuánto necesita cambio?</label>
            <input
              type="number"
              id="cambio"
              name="cambio"
              value={formData.cambio}
              onChange={handleChange}
              placeholder="Ej: 50000"
            />
          </div>
        )}

        <div className="total-pedido">
          <strong>Total del pedido: ${total?.toLocaleString()}</strong>
        </div>

        <button type="submit" className="btn-confirmar">
          Confirmar Pedido
        </button>
      </form>
    </div>
  );
}

export default DomicilioForm; 