import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Promociones from './components/Promociones';
import Pedido from './components/Pedido';
import Contacto from './components/Contacto';

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center">POLLOS CARTOONS</h1>
      <Menu />
      <Promociones />
      <Pedido />
      <Contacto />
    </div>
  );
}

export default App;