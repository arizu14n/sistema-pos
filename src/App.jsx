import React, { useState, useEffect } from 'react';
import PosView from './components/PosView';
import BackOfficeView from './components/BackOfficeView';
import PinModal from './components/PinModal';

const App = () => {
  const [view, setView] = useState('pos'); // 'pos' | 'backoffice'
  const [db, setDb] = useState([]); // Ahora empieza vacío y se llena desde SQLite
  const [sales, setSales] = useState([]); // Estado para el historial de ventas
  const [showPinModal, setShowPinModal] = useState(false);

  // --- CARGA INICIAL DE DATOS ---
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    // Pedimos los datos al Backend (main.js -> db.js)
    const productosReales = await window.electronAPI.getProducts();
    setDb(productosReales);
  };

  // --- LÓGICA DE NEGOCIO ---

  // Vender (Guardar en DB y recargar)
  const handleProcessSale = async (carrito, total) => {
    try {
      await window.electronAPI.createSale({ items: carrito, total });
      await window.electronAPI.alert(`Venta registrada por $${total}.`);
      await cargarProductos(); // Recargamos para ver el stock actualizado
    } catch (error) {
      await window.electronAPI.alert("Error al procesar venta: " + error);
    }
  };

  // Actualizar Producto (Guardar en DB y recargar)
  const handleUpdateProduct = async (productoEditado) => {
    try {
      await window.electronAPI.updateProduct(productoEditado);
      await cargarProductos(); // Recargamos
    } catch (error) {
      await window.electronAPI.alert("Error al actualizar: " + error);
    }
  };

  // Crear Producto (Guardar en DB y recargar)
  const handleCreateProduct = async (nuevoProducto) => {
    try {
      await window.electronAPI.createProduct(nuevoProducto);
      await cargarProductos(); // Recargamos para ver el nuevo producto en la lista
    } catch (error) {
      await window.electronAPI.alert("Error al crear producto: " + error);
    }
  };

  // Borrar Producto (lógico)
  const handleDeleteProduct = async (id) => {
    try {
      await window.electronAPI.deleteProduct(id);
      await cargarProductos(); // Recargamos para que desaparezca de la lista
    } catch (error) {
      await window.electronAPI.alert("Error al borrar producto: " + error);
    }
  };

  // Obtener historial de ventas
  const handleGetSales = async (filter) => {
    try {
      const salesData = await window.electronAPI.getSales(filter);
      setSales(salesData);
    } catch (error) {
      alert("Error al obtener ventas: " + error);
    }
  };

  const handleOpenAdmin = () => {
    setShowPinModal(true);
  };

  const handlePinSubmit = async (pin) => {
    const ADMIN_PIN = '1234'; // PIN de administrador (hardcodeado por ahora)
    if (pin === ADMIN_PIN) {
      setView('backoffice');
      setShowPinModal(false);
    } else {
      await window.electronAPI.alert('PIN incorrecto.');
    }
  };

  const handleClosePinModal = () => {
    setShowPinModal(false);
  };

  return (
    <>
      {showPinModal && <PinModal onPinSubmit={handlePinSubmit} onCancel={handleClosePinModal} />}
      {view === 'pos' ? (
        <PosView 
          db={db} 
          onProcessSale={handleProcessSale} 
          onOpenAdmin={handleOpenAdmin} 
        />
      ) : (
        <BackOfficeView 
          db={db} 
          sales={sales}
          onUpdateProduct={handleUpdateProduct}
          onCreateProduct={handleCreateProduct}
          onDeleteProduct={handleDeleteProduct}
          onGetSales={handleGetSales}
          onBack={() => setView('pos')}
        />
      )}
    </>
  );
};

export default App;