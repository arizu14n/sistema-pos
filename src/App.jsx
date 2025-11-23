import React, { useState, useEffect } from 'react';
import PosView from './components/PosView';
import BackOfficeView from './components/BackOfficeView';

// Importamos ipcRenderer de forma segura para comunicarnos con Electron
const { ipcRenderer } = window.require('electron');

const App = () => {
  const [view, setView] = useState('pos'); // 'pos' | 'backoffice'
  const [db, setDb] = useState([]); // Ahora empieza vacío y se llena desde SQLite

  // --- CARGA INICIAL DE DATOS ---
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    // Pedimos los datos al Backend (main.js -> db.js)
    const productosReales = await ipcRenderer.invoke('get-products');
    setDb(productosReales);
  };

  // --- LÓGICA DE NEGOCIO ---

  // Vender (Guardar en DB y recargar)
  const handleProcessSale = async (carrito, total) => {
    try {
      await ipcRenderer.invoke('create-sale', { items: carrito, total });
      alert(`Venta registrada por $${total}.`);
      cargarProductos(); // Recargamos para ver el stock actualizado
    } catch (error) {
      alert("Error al procesar venta: " + error);
    }
  };

  // Actualizar Producto (Guardar en DB y recargar)
  const handleUpdateProduct = async (productoEditado) => {
    try {
      await ipcRenderer.invoke('update-product', productoEditado);
      cargarProductos(); // Recargamos
    } catch (error) {
      alert("Error al actualizar: " + error);
    }
  };

  return (
    <>
      {view === 'pos' ? (
        <PosView 
          db={db} 
          onProcessSale={handleProcessSale} 
          onOpenAdmin={() => setView('backoffice')} 
        />
      ) : (
        <BackOfficeView 
          db={db} 
          onUpdateProduct={handleUpdateProduct}
          onBack={() => setView('pos')} 
        />
      )}
    </>
  );
};

export default App;