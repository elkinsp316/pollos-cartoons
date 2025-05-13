import React, { useState } from 'react'
import './Inventario.css'

function Inventario() {
  const [tabActual, setTabActual] = useState('pollos')
  const [nuevoItem, setNuevoItem] = useState({
    nombre: '',
    cantidad: '',
    precioCompra: '',
    proveedor: '',
    fecha: new Date().toISOString().split('T')[0]
  })
  const [inventario, setInventario] = useState({
    pollos: [],
    insumos: []
  })

  const agregarItem = (e) => {
    e.preventDefault()
    if (nuevoItem.nombre && nuevoItem.cantidad && nuevoItem.precioCompra) {
      setInventario({
        ...inventario,
        [tabActual]: [
          ...inventario[tabActual],
          {
            ...nuevoItem,
            id: Date.now(),
            fechaRegistro: new Date().toISOString(),
            estado: 'disponible'
          }
        ]
      })
      setNuevoItem({
        nombre: '',
        cantidad: '',
        precioCompra: '',
        proveedor: '',
        fecha: new Date().toISOString().split('T')[0]
      })
    }
  }

  const ajustarStock = (id, cantidad) => {
    setInventario({
      ...inventario,
      [tabActual]: inventario[tabActual].map(item =>
        item.id === id
          ? { ...item, cantidad: parseInt(item.cantidad) + parseInt(cantidad) }
          : item
      )
    })
  }

  const verificarStockBajo = (item) => {
    const limites = {
      pollos: 10,
      insumos: 5
    }
    return parseInt(item.cantidad) <= limites[tabActual]
  }

  return (
    <div className="inventario-container">
      <div className="inventario-tabs">
        <button 
          className={tabActual === 'pollos' ? 'active' : ''} 
          onClick={() => setTabActual('pollos')}
        >
          Pollos
        </button>
        <button 
          className={tabActual === 'insumos' ? 'active' : ''} 
          onClick={() => setTabActual('insumos')}
        >
          Insumos
        </button>
      </div>

      <div className="inventario-content">
        <div className="formulario-inventario">
          <h3>Agregar {tabActual === 'pollos' ? 'Pollos' : 'Insumos'}</h3>
          <form onSubmit={agregarItem}>
            <div className="form-group">
              <label>
                Nombre/Descripción:
                <input
                  type="text"
                  value={nuevoItem.nombre}
                  onChange={(e) => setNuevoItem({...nuevoItem, nombre: e.target.value})}
                  placeholder={tabActual === 'pollos' ? 'Ej: Pollo Fresco' : 'Ej: Papas'}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Cantidad:
                <input
                  type="number"
                  value={nuevoItem.cantidad}
                  onChange={(e) => setNuevoItem({...nuevoItem, cantidad: e.target.value})}
                  placeholder={tabActual === 'pollos' ? 'Número de pollos' : 'Cantidad en kg/unidades'}
                  min="0"
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Precio de Compra:
                <input
                  type="number"
                  value={nuevoItem.precioCompra}
                  onChange={(e) => setNuevoItem({...nuevoItem, precioCompra: e.target.value})}
                  placeholder="Precio por unidad"
                  min="0"
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Proveedor:
                <input
                  type="text"
                  value={nuevoItem.proveedor}
                  onChange={(e) => setNuevoItem({...nuevoItem, proveedor: e.target.value})}
                  placeholder="Nombre del proveedor"
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Fecha:
                <input
                  type="date"
                  value={nuevoItem.fecha}
                  onChange={(e) => setNuevoItem({...nuevoItem, fecha: e.target.value})}
                  required
                />
              </label>
            </div>
            <button type="submit" className="btn-agregar">
              Agregar al Inventario
            </button>
          </form>
        </div>

        <div className="lista-inventario">
          <h3>Inventario Actual</h3>
          {inventario[tabActual].length === 0 ? (
            <p>No hay {tabActual} registrados en el inventario</p>
          ) : (
            <div className="tabla-inventario">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio Compra</th>
                    <th>Proveedor</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventario[tabActual].map(item => (
                    <tr key={item.id} className={verificarStockBajo(item) ? 'stock-bajo' : ''}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>${item.precioCompra}</td>
                      <td>{item.proveedor}</td>
                      <td>{new Date(item.fecha).toLocaleDateString()}</td>
                      <td>
                        <div className="acciones-inventario">
                          <button 
                            onClick={() => ajustarStock(item.id, 1)}
                            className="btn-ajuste"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => ajustarStock(item.id, -1)}
                            className="btn-ajuste"
                            disabled={item.cantidad <= 0}
                          >
                            -
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Inventario 