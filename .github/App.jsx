import React, { useState, useEffect } from 'react';
import ProductoCatalogo from './components/ProductoCatalogo';
import Carrito from './components/Carrito';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [productos, setProductos] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Cargar productos del localStorage al iniciar
  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    } else {
      // Si no hay productos guardados, usar los productos por defecto
      setProductos([
        {
          id: 1,
          nombre: 'Pollo Entero',
          precio: 35000,
          imagen: '/productos/pollo-entero.jpg',
          descripcion: 'Pollo a la brasa entero, dorado y jugoso, acompañado de papas fritas y ensalada fresca',
          categoria: 'Pollos',
          opciones: ['Con ají', 'Sin ají', 'Extra papas', 'Extra ensalada'],
          etiquetas: ['Popular', 'Familiar'],
          tiempo: '15-20 min'
        },
        // ... otros productos por defecto
      ]);
    }
  }, []);

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }, [productos]);

  const handleAgregarProducto = (producto) => {
    const itemExistente = carrito.find(item => 
      item.id === producto.id && item.opcion === producto.opcion
    );

    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id && item.opcion === producto.opcion
          ? { ...item, cantidad: item.cantidad + producto.cantidad }
          : item
      ));
    } else {
      setCarrito([...carrito, producto]);
    }
  };

  const handleRemoveItem = (itemId) => {
    setCarrito(carrito.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCarrito(carrito.map(item =>
      item.id === itemId ? { ...item, cantidad: newQuantity } : item
    ));
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleUpdateProductos = (nuevosProductos) => {
    setProductos(nuevosProductos);
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍗 Pollos App</h1>
        <div className="header-buttons">
          <button 
            className="btn-carrito"
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
          >
            {mostrarCarrito ? 'Ver Menú' : `Ver Carrito (${carrito.length})`}
          </button>
          {!isAdmin ? (
            <button 
              className="btn-admin"
              onClick={() => setShowAdminLogin(true)}
            >
              Administrador
            </button>
          ) : (
            <button 
              className="btn-logout"
              onClick={() => setIsAdmin(false)}
            >
              Salir
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {isAdmin ? (
          <AdminPanel 
            productos={productos}
            onUpdateProductos={handleUpdateProductos}
          />
        ) : (
          mostrarCarrito ? (
            <Carrito 
              items={carrito}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ) : (
            <ProductoCatalogo 
              productos={productos}
              onAgregarProducto={handleAgregarProducto} 
            />
          )
        )}
      </main>
    </div>
  );
}

export default App; 