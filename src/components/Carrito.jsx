import React, { useState } from 'react';
import { FaTrash, FaWhatsapp } from 'react-icons/fa';
import './Carrito.css';

const Carrito = ({ items, onRemoveItem, onUpdateQuantity }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    metodoPago: 'efectivo',
    notas: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es requerida';
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono.trim())) {
      nuevosErrores.telefono = 'El teléfono debe tener 10 dígitos';
    }
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const handleEnviarPedido = () => {
    if (!validarFormulario()) return;

    const mensaje = generarMensajePedido();
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  const generarMensajePedido = () => {
    const detallesPedido = items.map(item => 
      `• ${item.cantidad}x ${item.nombre} ${item.opcion ? `(${item.opcion})` : ''} - $${(item.precio * item.cantidad).toLocaleString()}`
    ).join('\n');

    return `🍗 *NUEVO PEDIDO*\n\n` +
           `*Datos del cliente:*\n` +
           `Nombre: ${formData.nombre}\n` +
           `Dirección: ${formData.direccion}\n` +
           `Teléfono: ${formData.telefono}\n` +
           `Método de pago: ${formData.metodoPago}\n\n` +
           `*Pedido:*\n${detallesPedido}\n\n` +
           `*Total: $${calcularTotal().toLocaleString()}*\n\n` +
           `${formData.notas ? `*Notas:* ${formData.notas}\n\n` : ''}` +
           `¡Gracias por tu pedido! 🙏`;
  };

  return (
    <div className="carrito-container">
      <h2>Tu Pedido</h2>
      
      {items.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está vacío</p>
          <button onClick={() => window.history.back()}>Ver Menú</button>
        </div>
      ) : (
        <>
          <div className="items-lista">
            {items.map(item => (
              <div key={`${item.id}-${item.opcion}`} className="carrito-item">
                <img src={item.imagen} alt={item.nombre} />
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  {item.opcion && <p className="item-opcion">{item.opcion}</p>}
                  <div className="item-controles">
                    <div className="cantidad-controles">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}>
                        +
                      </button>
                    </div>
                    <button 
                      className="btn-eliminar"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="item-precio">
                  ${(item.precio * item.cantidad).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="total-seccion">
            <span>Total:</span>
            <span className="total-monto">${calcularTotal().toLocaleString()}</span>
          </div>

          <form className="formulario-pedido" onSubmit={(e) => e.preventDefault()}>
            <h3>Datos de Entrega</h3>
            
            <div className="form-grupo">
              <label htmlFor="nombre">Nombre completo*</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-mensaje">{errors.nombre}</span>}
            </div>

            <div className="form-grupo">
              <label htmlFor="direccion">Dirección de entrega*</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className={errors.direccion ? 'error' : ''}
              />
              {errors.direccion && <span className="error-mensaje">{errors.direccion}</span>}
            </div>

            <div className="form-grupo">
              <label htmlFor="telefono">Teléfono*</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className={errors.telefono ? 'error' : ''}
                placeholder="3001234567"
              />
              {errors.telefono && <span className="error-mensaje">{errors.telefono}</span>}
            </div>

            <div className="form-grupo">
              <label htmlFor="metodoPago">Método de pago</label>
              <select
                id="metodoPago"
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
              >
                <option value="efectivo">Efectivo</option>
                <option value="nequi">Nequi</option>
                <option value="daviplata">Daviplata</option>
              </select>
            </div>

            <div className="form-grupo">
              <label htmlFor="notas">Notas adicionales</label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                placeholder="Instrucciones especiales, referencias, etc."
              />
            </div>

            <button 
              className="btn-enviar-pedido"
              onClick={handleEnviarPedido}
            >
              <FaWhatsapp /> Enviar Pedido por WhatsApp
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Carrito; 