import React, { useState } from 'react';
import { FaPlus, FaMinus, FaShoppingCart, FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import './ProductoCatalogo.css';

const categorias = ['Todos', 'Pollos', 'Alitas', 'Combos', 'Hamburguesas', 'Favoritos'];

const ProductoCatalogo = ({ productos, onAgregarProducto }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="catalogo-container">
      <div className="filtros-container">
        <div className="busqueda">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="categorias">
          {categorias.map(categoria => (
            <button
              key={categoria}
              className={`categoria-btn ${categoriaSeleccionada === categoria ? 'activo' : ''}`}
              onClick={() => setCategoriaSeleccionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      <div className="productos-grid">
        {productosFiltrados.map(producto => (
          <div key={producto.id} className="producto-card">
            <div className="producto-imagen">
              <img src={producto.imagen} alt={producto.nombre} />
              {producto.etiquetas && producto.etiquetas.map(etiqueta => (
                <span key={etiqueta} className={`etiqueta ${etiqueta.toLowerCase()}`}>
                  {etiqueta === 'Popular' && <FaStar />} {etiqueta}
                </span>
              ))}
            </div>
            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              <p className="descripcion">{producto.descripcion}</p>
              <p className="tiempo">⏱️ {producto.tiempo}</p>
              <p className="precio">$ {producto.precio.toLocaleString()}</p>
              <button 
                className="agregar-btn"
                onClick={() => onAgregarProducto({
                  ...producto,
                  cantidad: 1,
                  opcion: producto.opciones ? producto.opciones[0] : null
                })}
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductoCatalogo; 