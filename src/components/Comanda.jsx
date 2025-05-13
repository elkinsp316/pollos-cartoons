import React, { useState } from 'react'

const MENU_ITEMS = {
  pollos: [
    { id: 1, nombre: 'Pollo Entero', precio: 28000 },
    { id: 2, nombre: '1/2 Pollo', precio: 15000 },
    { id: 3, nombre: '1/4 Pollo', precio: 8000 },
  ],
  adicionales: [
    { id: 4, nombre: 'Papas Fritas', precio: 5000 },
    { id: 5, nombre: 'Ensalada', precio: 3000 },
    { id: 6, nombre: 'Arroz', precio: 2000 },
    { id: 7, nombre: 'Gaseosa', precio: 3000 },
  ]
}

function Comanda({ mesaNumero, onGuardar }) {
  const [items, setItems] = useState([])
  const [observaciones, setObservaciones] = useState('')

  const agregarItem = (item) => {
    setItems([...items, { ...item, cantidad: 1, id: Date.now() }])
  }

  const eliminarItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const cambiarCantidad = (id, nuevaCantidad) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ))
  }

  const calcularTotal = () => {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const guardarComanda = () => {
    onGuardar({
      mesa: mesaNumero,
      items,
      observaciones,
      total: calcularTotal(),
      fecha: new Date(),
      estado: 'pendiente'
    })
  }

  return (
    <div className="comanda">
      <h3>Mesa {mesaNumero}</h3>
      
      <div className="menu-section">
        <h4>Pollos</h4>
        <div className="menu-items">
          {MENU_ITEMS.pollos.map(item => (
            <button 
              key={item.id}
              onClick={() => agregarItem(item)}
              className="menu-item-button"
            >
              {item.nombre}
              <span>${item.precio}</span>
            </button>
          ))}
        </div>

        <h4>Adicionales</h4>
        <div className="menu-items">
          {MENU_ITEMS.adicionales.map(item => (
            <button 
              key={item.id}
              onClick={() => agregarItem(item)}
              className="menu-item-button"
            >
              {item.nombre}
              <span>${item.precio}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="orden-actual">
        <h4>Orden Actual</h4>
        {items.length === 0 ? (
          <p>No hay items en la orden</p>
        ) : (
          <ul className="items-lista">
            {items.map(item => (
              <li key={item.id} className="item-orden">
                <span>{item.nombre}</span>
                <div className="item-controles">
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => cambiarCantidad(item.id, parseInt(e.target.value))}
                  />
                  <span>${item.precio * item.cantidad}</span>
                  <button 
                    onClick={() => eliminarItem(item.id)}
                    className="boton-eliminar"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="observaciones">
          <textarea
            placeholder="Observaciones..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <div className="total">
          <h4>Total: ${calcularTotal()}</h4>
        </div>

        <button 
          className="guardar-comanda"
          onClick={guardarComanda}
          disabled={items.length === 0}
        >
          Guardar Comanda
        </button>
      </div>
    </div>
  )
}

export default Comanda 