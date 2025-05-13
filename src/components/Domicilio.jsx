import React, { useState } from 'react';
import { FaWhatsapp, FaMotorcycle, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import ProductoCatalogo from './ProductoCatalogo';
import './Domicilio.css';

function Domicilio({ onRegistrarVenta }) {
  const [pedido, setPedido] = useState({
    cliente: '',
    direccion: '',
    telefono: '',
    items: [],
    total: 0,
    observaciones: '',
    costoEnvio: 0
  });

  const agregarProducto = (producto) => {
    const itemExistente = pedido.items.find(item => item.id === producto.id);
    
    if (itemExistente) {
      const itemsActualizados = pedido.items.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      
      setPedido({
        ...pedido,
        items: itemsActualizados,
        total: calcularTotal(itemsActualizados)
      });
    } else {
      const nuevosItems = [...pedido.items, producto];
      setPedido({
        ...pedido,
        items: nuevosItems,
        total: calcularTotal(nuevosItems)
      });
    }
  };

  const calcularTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  };

  const actualizarCantidad = (id, incremento) => {
    const itemsActualizados = pedido.items.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + incremento;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
      }
      return item;
    }).filter(Boolean);

    setPedido({
      ...pedido,
      items: itemsActualizados,
      total: calcularTotal(itemsActualizados)
    });
  };

  const eliminarProducto = (id) => {
    const itemsActualizados = pedido.items.filter(item => item.id !== id);
    setPedido({
      ...pedido,
      items: itemsActualizados,
      total: calcularTotal(itemsActualizados)
    });
  };

  const enviarWhatsApp = () => {
    const mensaje = `🏍️ *Nuevo Pedido a Domicilio*\n\n` +
      `*Cliente:* ${pedido.cliente}\n` +
      `*Dirección:* ${pedido.direccion}\n` +
      `*Teléfono:* ${pedido.telefono}\n\n` +
      `*Pedido:*\n${pedido.items.map(item => 
        `- ${item.cantidad}x ${item.nombre} ($${item.precio * item.cantidad})`
      ).join('\n')}\n\n` +
      `*Costo de envío:* $${pedido.costoEnvio}\n` +
      `*Total:* $${pedido.total + pedido.costoEnvio}\n\n` +
      `*Observaciones:* ${pedido.observaciones || 'Ninguna'}`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${pedido.telefono}?text=${mensajeCodificado}`, '_blank');
  };

  const registrarPedido = () => {
    const ventaDomicilio = {
      ...pedido,
      tipo: 'domicilio',
      fecha: new Date(),
      estado: 'pendiente',
      metodoPago: 'efectivo'
    };
    
    onRegistrarVenta(ventaDomicilio);
    enviarWhatsApp();
    
    // Limpiar formulario
    setPedido({
      cliente: '',
      direccion: '',
      telefono: '',
      items: [],
      total: 0,
      observaciones: '',
      costoEnvio: 0
    });
  };

  return (
    <div className="domicilio-container">
      <h2><FaMotorcycle /> Pedido a Domicilio</h2>
      
      <div className="form-group">
        <label>Cliente:</label>
        <input
          type="text"
          value={pedido.cliente}
          onChange={(e) => setPedido({...pedido, cliente: e.target.value})}
          placeholder="Nombre del cliente"
        />
      </div>

      <div className="form-group">
        <label>Dirección:</label>
        <input
          type="text"
          value={pedido.direccion}
          onChange={(e) => setPedido({...pedido, direccion: e.target.value})}
          placeholder="Dirección de entrega"
        />
      </div>

      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type="tel"
          value={pedido.telefono}
          onChange={(e) => setPedido({...pedido, telefono: e.target.value})}
          placeholder="Número de WhatsApp"
        />
      </div>

      <div className="seccion-productos">
        <h3>Seleccionar Productos</h3>
        <ProductoCatalogo onAgregarProducto={agregarProducto} />
      </div>

      <div className="lista-productos">
        <h3>Productos en el Pedido</h3>
        {pedido.items.map(item => (
          <div key={item.id} className="item-pedido">
            <div className="item-info">
              <span>{item.nombre}</span>
              <span className="item-precio">${(item.precio * item.cantidad).toLocaleString()}</span>
            </div>
            <div className="item-acciones">
              <button 
                className="btn-cantidad"
                onClick={() => actualizarCantidad(item.id, -1)}
              >
                <FaMinus />
              </button>
              <span className="cantidad">{item.cantidad}</span>
              <button 
                className="btn-cantidad"
                onClick={() => actualizarCantidad(item.id, 1)}
              >
                <FaPlus />
              </button>
              <button 
                className="btn-eliminar"
                onClick={() => eliminarProducto(item.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Costo de Envío:</label>
        <input
          type="number"
          value={pedido.costoEnvio}
          onChange={(e) => setPedido({...pedido, costoEnvio: parseFloat(e.target.value) || 0})}
          placeholder="Costo de envío"
        />
      </div>

      <div className="form-group">
        <label>Observaciones:</label>
        <textarea
          value={pedido.observaciones}
          onChange={(e) => setPedido({...pedido, observaciones: e.target.value})}
          placeholder="Instrucciones especiales, referencias, etc."
        />
      </div>

      <div className="total-pedido">
        <h3>Total del Pedido: ${(pedido.total + pedido.costoEnvio).toLocaleString()}</h3>
      </div>

      <div className="acciones-pedido">
        <button 
          className="btn-registrar"
          onClick={registrarPedido}
          disabled={!pedido.cliente || !pedido.direccion || !pedido.telefono || pedido.items.length === 0}
        >
          Registrar Pedido
        </button>
        <button 
          className="btn-whatsapp"
          onClick={enviarWhatsApp}
          disabled={!pedido.cliente || !pedido.telefono}
        >
          <FaWhatsapp /> Enviar por WhatsApp
        </button>
      </div>
    </div>
  );
}

export default Domicilio; 