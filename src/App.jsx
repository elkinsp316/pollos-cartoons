import React, { useState } from 'react'
import './App.css'
import Comanda from './components/Comanda'
import Inventario from './components/Inventario'

function App() {
  const [seccionActual, setSeccionActual] = useState('comandas')
  const [comandas, setComandas] = useState([])
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)
  const [empleados, setEmpleados] = useState([])
  const [ventas, setVentas] = useState([])

  const guardarComanda = (comanda) => {
    setComandas([...comandas, comanda])
    setMesaSeleccionada(null)
  }

  return (
    <div className="app-container">
      {/* Barra de navegación */}
      <nav className="navbar">
        <h1>Asadero - Sistema de Gestión</h1>
        <div className="nav-buttons">
          <button 
            className={seccionActual === 'comandas' ? 'active' : ''} 
            onClick={() => setSeccionActual('comandas')}
          >
            Comandas
          </button>
          <button 
            className={seccionActual === 'inventario' ? 'active' : ''} 
            onClick={() => setSeccionActual('inventario')}
          >
            Inventario
          </button>
          <button 
            className={seccionActual === 'ventas' ? 'active' : ''} 
            onClick={() => setSeccionActual('ventas')}
          >
            Ventas
          </button>
          <button 
            className={seccionActual === 'empleados' ? 'active' : ''} 
            onClick={() => setSeccionActual('empleados')}
          >
            Empleados
          </button>
          <button 
            className={seccionActual === 'reportes' ? 'active' : ''} 
            onClick={() => setSeccionActual('reportes')}
          >
            Reportes
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="main-content">
        {seccionActual === 'comandas' && (
          <div className="comandas-section">
            {mesaSeleccionada ? (
              <Comanda 
                mesaNumero={mesaSeleccionada}
                onGuardar={guardarComanda}
              />
            ) : (
              <>
                <h2>Seleccionar Mesa</h2>
                <div className="mesas-grid">
                  {[1, 2, 3, 4, 5, 6].map(mesa => (
                    <button 
                      key={mesa} 
                      className="mesa-button"
                      onClick={() => setMesaSeleccionada(mesa)}
                    >
                      Mesa {mesa}
                      {comandas.find(c => c.mesa === mesa && c.estado === 'pendiente') && (
                        <span className="mesa-ocupada">Ocupada</span>
                      )}
                    </button>
                  ))}
                </div>
                {comandas.length > 0 && (
                  <div className="comandas-activas">
                    <h3>Comandas Activas</h3>
                    <div className="comandas-lista">
                      {comandas
                        .filter(c => c.estado === 'pendiente')
                        .map(comanda => (
                          <div key={comanda.fecha} className="comanda-activa">
                            <h4>Mesa {comanda.mesa}</h4>
                            <p>Total: ${comanda.total}</p>
                            <button 
                              className="completar-comanda"
                              onClick={() => {
                                setComandas(comandas.map(c => 
                                  c.fecha === comanda.fecha 
                                    ? {...c, estado: 'completada'} 
                                    : c
                                ))
                              }}
                            >
                              Completar
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {seccionActual === 'inventario' && <Inventario />}

        {seccionActual === 'ventas' && (
          <div className="ventas-section">
            <h2>Registro de Ventas</h2>
            <div className="ventas-filtros">
              <input type="date" />
              <button>Buscar</button>
            </div>
            <div className="ventas-lista">
              {/* Lista de ventas */}
            </div>
          </div>
        )}

        {seccionActual === 'empleados' && (
          <div className="empleados-section">
            <h2>Gestión de Empleados</h2>
            <div className="empleados-lista">
              {/* Lista de empleados */}
            </div>
          </div>
        )}

        {seccionActual === 'reportes' && (
          <div className="reportes-section">
            <h2>Reportes</h2>
            <div className="reportes-opciones">
              <button>Reporte de Ventas</button>
              <button>Reporte de Inventario</button>
              <button>Balance General</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 