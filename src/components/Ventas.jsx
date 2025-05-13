import React, { useState } from 'react'
import './Ventas.css'
import Domicilio from './Domicilio'
import Modal from 'react-modal'
import { FaMotorcycle } from 'react-icons/fa'

function Ventas() {
  const [ventasDiarias, setVentasDiarias] = useState([])
  const [cajaActual, setCajaActual] = useState({
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0
  })
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0])
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [modalDomicilioAbierto, setModalDomicilioAbierto] = useState(false)

  // Función para registrar una venta desde una comanda
  const registrarVenta = (comanda) => {
    const nuevaVenta = {
      id: Date.now(),
      fecha: new Date(),
      mesa: comanda.mesa,
      items: comanda.items,
      total: comanda.total,
      metodoPago: 'efectivo',
      estado: 'completada',
      observaciones: comanda.observaciones,
      tipo: comanda.tipo || 'local'
    }
    setVentasDiarias([...ventasDiarias, nuevaVenta])
    actualizarCaja('efectivo', comanda.total)
  }

  // Función para actualizar la caja según el método de pago
  const actualizarCaja = (metodoPago, monto) => {
    setCajaActual({
      ...cajaActual,
      [metodoPago]: cajaActual[metodoPago] + parseFloat(monto)
    })
  }

  // Función para filtrar ventas por fecha
  const ventasFiltradas = () => {
    return ventasDiarias.filter(venta => {
      const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0]
      const cumpleFecha = fechaVenta === fechaSeleccionada
      const cumpleEstado = filtroEstado === 'todas' || venta.estado === filtroEstado
      return cumpleFecha && cumpleEstado
    })
  }

  // Calcular totales del día
  const calcularTotales = () => {
    const ventas = ventasFiltradas()
    return {
      total: ventas.reduce((sum, venta) => sum + venta.total, 0),
      cantidad: ventas.length,
      promedioVenta: ventas.length ? (ventas.reduce((sum, venta) => sum + venta.total, 0) / ventas.length).toFixed(2) : 0,
      domicilios: ventas.filter(v => v.tipo === 'domicilio').length
    }
  }

  return (
    <div className="ventas-container">
      <div className="panel-superior">
        <div className="caja-actual">
          <h3>Caja Actual</h3>
          <div className="metodos-pago">
            <div className="metodo">
              <span>Efectivo:</span>
              <strong>${cajaActual.efectivo.toLocaleString()}</strong>
            </div>
            <div className="metodo">
              <span>Tarjeta:</span>
              <strong>${cajaActual.tarjeta.toLocaleString()}</strong>
            </div>
            <div className="metodo">
              <span>Transferencia:</span>
              <strong>${cajaActual.transferencia.toLocaleString()}</strong>
            </div>
            <div className="total-caja">
              <span>Total en Caja:</span>
              <strong>
                ${(cajaActual.efectivo + cajaActual.tarjeta + cajaActual.transferencia).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        <div className="filtros-ventas">
          <div className="filtro-grupo">
            <label>Fecha:</label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </div>
          <div className="filtro-grupo">
            <label>Estado:</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="completada">Completadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
          <button 
            className="btn-nuevo-domicilio"
            onClick={() => setModalDomicilioAbierto(true)}
          >
            <FaMotorcycle /> Nuevo Domicilio
          </button>
        </div>
      </div>

      <div className="resumen-ventas">
        <div className="estadistica">
          <span>Total Ventas</span>
          <strong>${calcularTotales().total.toLocaleString()}</strong>
        </div>
        <div className="estadistica">
          <span>Cantidad Ventas</span>
          <strong>{calcularTotales().cantidad}</strong>
        </div>
        <div className="estadistica">
          <span>Promedio por Venta</span>
          <strong>${parseFloat(calcularTotales().promedioVenta).toLocaleString()}</strong>
        </div>
        <div className="estadistica">
          <span>Domicilios</span>
          <strong>{calcularTotales().domicilios}</strong>
        </div>
      </div>

      <div className="lista-ventas">
        <h3>Registro de Ventas</h3>
        {ventasFiltradas().length === 0 ? (
          <p className="sin-ventas">No hay ventas registradas para esta fecha</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Mesa/Cliente</th>
                <th>Items</th>
                <th>Total</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas().map(venta => (
                <tr key={venta.id} className={venta.tipo}>
                  <td>{new Date(venta.fecha).toLocaleTimeString()}</td>
                  <td>{venta.tipo === 'domicilio' ? 'Domicilio' : 'Local'}</td>
                  <td>
                    {venta.tipo === 'domicilio' ? 
                      `${venta.cliente} - ${venta.direccion}` : 
                      `Mesa ${venta.mesa}`
                    }
                  </td>
                  <td>
                    <ul className="items-venta">
                      {venta.items.map(item => (
                        <li key={item.id}>
                          {item.cantidad}x {item.nombre}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${venta.total.toLocaleString()}</td>
                  <td>{venta.metodoPago}</td>
                  <td>
                    <span className={`estado-venta ${venta.estado}`}>
                      {venta.estado}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-imprimir"
                      onClick={() => window.print()}
                    >
                      Imprimir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="acciones-caja">
        <button className="btn-cerrar-caja">
          Cerrar Caja
        </button>
        <button className="btn-imprimir-reporte">
          Imprimir Reporte
        </button>
      </div>

      <Modal
        isOpen={modalDomicilioAbierto}
        onRequestClose={() => setModalDomicilioAbierto(false)}
        className="modal-domicilio"
        overlayClassName="modal-overlay"
      >
        <Domicilio 
          onRegistrarVenta={(ventaDomicilio) => {
            registrarVenta(ventaDomicilio);
            setModalDomicilioAbierto(false);
          }} 
        />
      </Modal>
    </div>
  )
}

export default Ventas 