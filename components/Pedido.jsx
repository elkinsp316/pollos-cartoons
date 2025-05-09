import emailjs from 'emailjs-com';
import { useRef } from 'react';

function Pedido() {
  const form = useRef();

  const enviarPedido = (e) => {
    e.preventDefault();
    emailjs.sendForm('TU_SERVICE_ID', 'TU_TEMPLATE_ID', form.current, 'TU_USER_ID')
      .then(() => alert('¡Pedido enviado!'))
      .catch(() => alert('Error al enviar el pedido'));
  };

  return (
    <section>
      <h2>Hacer Pedido</h2>
      <form ref={form} onSubmit={enviarPedido}>
        <input name="nombre" placeholder="Tu nombre" required className="form-control mb-2" />
        <input name="direccion" placeholder="Dirección" required className="form-control mb-2" />
        <input name="pedido" placeholder="¿Qué deseas pedir?" required className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Enviar Pedido</button>
      </form>
    </section>
  );
}

export default Pedido;