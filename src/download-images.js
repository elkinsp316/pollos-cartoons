const fs = require('fs');
const https = require('https');
const path = require('path');

const PRODUCTOS_DIR = path.join(__dirname, 'public', 'productos');

// Crear el directorio si no existe
if (!fs.existsSync(PRODUCTOS_DIR)) {
  fs.mkdirSync(PRODUCTOS_DIR, { recursive: true });
}

const imagenes = [
  {
    nombre: 'pollo-entero.jpg',
    url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781'  // Pollo asado entero
  },
  {
    nombre: 'medio-pollo.jpg',
    url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'  // Medio pollo asado
  },
  {
    nombre: 'cuarto-pollo.jpg',
    url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'  // Cuarto de pollo (usando la misma imagen)
  },
  {
    nombre: 'papas.jpg',
    url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f'  // Papas fritas
  },
  {
    nombre: 'ensalada.jpg',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'  // Ensalada fresca
  },
  {
    nombre: 'gaseosa.jpg',
    url: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1'  // Gaseosa
  }
];

console.log('🚀 Iniciando descarga de imágenes...');

const descargarImagen = (imagen) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(PRODUCTOS_DIR, imagen.nombre));
    
    https.get(`${imagen.url}?w=500&q=80`, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error al descargar ${imagen.nombre}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Imagen descargada: ${imagen.nombre}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(path.join(PRODUCTOS_DIR, imagen.nombre), () => {});
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(path.join(PRODUCTOS_DIR, imagen.nombre), () => {});
      reject(err);
    });
  });
};

// Descargar imágenes secuencialmente para evitar problemas de rate limiting
async function descargarImagenes() {
  try {
    for (const imagen of imagenes) {
      await descargarImagen(imagen);
    }
    console.log('✨ Todas las imágenes han sido descargadas correctamente');
  } catch (error) {
    console.error('❌ Error durante la descarga:', error);
  }
}

descargarImagenes(); 