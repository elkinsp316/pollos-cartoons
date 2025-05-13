import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './AdminPanel.css';

const AdminPanel = ({ productos, onUpdateProductos }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    opciones: '',
    etiquetas: '',
    tiempo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto.id);
    setFormData({
      ...producto,
      opciones: producto.opciones.join(', '),
      etiquetas: producto.etiquetas.join(', ')
    });
  };

  const handleDelete = (productoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const nuevosProductos = productos.filter(p => p.id !== productoId);
      onUpdateProductos(nuevosProductos);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productoActualizado = {
      ...formData,
      id: newProduct ? Date.now() : formData.id,
      precio: Number(formData.precio),
      opciones: formData.opciones.split(',').map(opt => opt.trim()).filter(Boolean),
      etiquetas: formData.etiquetas.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    let nuevosProductos;
    if (newProduct) {
      nuevosProductos = [...productos, productoActualizado];
    } else {
      nuevosProductos = productos.map(p => 
        p.id === productoActualizado.id ? productoActualizado : p
      );
    }

    onUpdateProductos(nuevosProductos);
    handleCancel();
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setNewProduct(false);
    setFormData({
      id: '',
      nombre: '',
      precio: '',
      descripcion: '',
      categoria: '',
      imagen: '',
      opciones: '',
      etiquetas: '',
      tiempo: ''
    });
  };

  const handleNewProduct = () => {
    setNewProduct(true);
    setEditingProduct(null);
    setFormData({
      id: '',
      nombre: '',
      precio: '',
      descripcion: '',
      categoria: '',
      imagen: '',
      opciones: '',
      etiquetas: '',
      tiempo: ''
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button 
          className="btn-nuevo"
          onClick={handleNewProduct}
          disabled={editingProduct !== null || newProduct}
        >
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      {(editingProduct !== null || newProduct) && (
        <form onSubmit={handleSubmit} className="producto-form">
          <h3>{newProduct ? 'Nuevo Producto' : 'Editar Producto'}</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre*</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio*</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría*</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="Pollos">Pollos</option>
                <option value="Alitas">Alitas</option>
                <option value="Combos">Combos</option>
                <option value="Hamburguesas">Hamburguesas</option>
                <option value="Complementos">Complementos</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tiempo">Tiempo de preparación*</label>
              <input
                type="text"
                id="tiempo"
                name="tiempo"
                value={formData.tiempo}
                onChange={handleInputChange}
                placeholder="ej: 15-20 min"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="descripcion">Descripción*</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="imagen">URL de la imagen*</label>
              <input
                type="url"
                id="imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="opciones">Opciones (separadas por comas)</label>
              <input
                type="text"
                id="opciones"
                name="opciones"
                value={formData.opciones}
                onChange={handleInputChange}
                placeholder="ej: Con ají, Sin ají, Extra papas"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="etiquetas">Etiquetas (separadas por comas)</label>
              <input
                type="text"
                id="etiquetas"
                name="etiquetas"
                value={formData.etiquetas}
                onChange={handleInputChange}
                placeholder="ej: Nuevo, Popular, Bestseller"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">
              <FaSave /> Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCancel}>
              <FaTimes /> Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="productos-lista">
        <h3>Productos</h3>
        <div className="productos-grid">
          {productos.map(producto => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <div className="producto-info">
                <h4>{producto.nombre}</h4>
                <p className="precio">${producto.precio.toLocaleString()}</p>
                <p className="categoria">{producto.categoria}</p>
                {producto.etiquetas.length > 0 && (
                  <div className="etiquetas">
                    {producto.etiquetas.map(etiqueta => (
                      <span key={etiqueta} className="etiqueta">
                        {etiqueta}
                      </span>
                    ))}
                  </div>
                )}
                <div className="producto-actions">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(producto)}
                    disabled={editingProduct !== null || newProduct}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDelete(producto.id)}
                    disabled={editingProduct !== null || newProduct}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 