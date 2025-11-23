import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowLeft, Save, X, TrendingUp, Package, Settings, PlusCircle, Trash2, Edit, FileText } from 'lucide-react';

const BackOfficeView = ({ db, sales, onUpdateProduct, onCreateProduct, onDeleteProduct, onGetSales, onBack }) => {
  const [editando, setEditando] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: 'General'
  });

  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    if (activeTab === 'reports') onGetSales(); // Carga inicial de ventas al abrir la pestaña
  }, [activeTab]);

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setForm(producto);
  };

  const handleSave = () => {
    if (isCreating) {
      onCreateProduct(form);
      setIsCreating(false);
    } else {
      onUpdateProduct(form);
      setEditando(null);
    }
  };

  const handleOpenCreate = () => {
    setForm({ codigo: '', nombre: '', precio: 0, stock: 0, categoria: 'General' });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditando(null);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      onDeleteProduct(id);
    }
  };

  const handleChange = (e, field) => {
    const val = e.target.value;
    setForm({ ...form, [field]: (field === 'precio' || field === 'stock') ? Number(val) : val });
  };

  const handleDateFilter = (filterType) => {
    const today = new Date();
    let startDate, endDate = new Date();

    switch (filterType) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'week':
        const firstDayOfWeek = today.getDate() - today.getDay();
        startDate = new Date(today.setDate(firstDayOfWeek));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default: // all
        onGetSales(); return;
    }
    onGetSales({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-blue-400" /> Panel de Control
        </h2>
        <button onClick={onBack} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex items-center gap-2 transition font-bold shadow">
            <ArrowLeft size={18} /> Volver a Vender
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full">
        {/* Pestañas de Navegación */}
        <div className="mb-6 border-b border-gray-300">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              Inventario
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium ${activeTab === 'reports' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              Reportes de Ventas
            </button>
          </nav>
        </div>

        {/* Dashboard Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center justify-between">
                <div><p className="text-gray-500 text-sm">Ventas Hoy</p><p className="text-2xl font-bold text-gray-800">$154,300</p></div>
                <TrendingUp className="text-green-500" size={32}/>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between">
                <div><p className="text-gray-500 text-sm">Productos</p><p className="text-2xl font-bold text-gray-800">{db.length}</p></div>
                <Package className="text-blue-500" size={32}/>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500 flex items-center justify-between">
                <div><p className="text-gray-500 text-sm">Stock Crítico</p><p className="text-2xl font-bold text-gray-800">{db.filter(p => p.stock < 10).length}</p></div>
                <Settings className="text-orange-500" size={32}/>
            </div>
        </div>

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-bold text-gray-800">Inventario</h3>
              <button onClick={handleOpenCreate} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow">
                <PlusCircle size={16} /> Nuevo Producto
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="text-gray-500 border-b bg-gray-50 text-xs uppercase font-semibold">
                      <th className="p-4">Código</th><th className="p-4">Nombre</th><th className="p-4 text-right">Precio</th><th className="p-4 text-right">Stock</th><th className="p-4 text-center">Acciones</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                  {isCreating && (
                    <tr className="bg-blue-50">
                      <td className="p-2"><input className="border rounded p-2 w-full" placeholder="Código de Barras" value={form.codigo} onChange={(e) => handleChange(e, 'codigo')} /></td>
                      <td className="p-2"><input className="border rounded p-2 w-full" placeholder="Nombre del producto" value={form.nombre} onChange={(e) => handleChange(e, 'nombre')} /></td>
                      <td className="p-2 text-right"><input type="number" className="border rounded p-2 w-24 text-right" value={form.precio} onChange={(e) => handleChange(e, 'precio')} /></td>
                      <td className="p-2 text-right"><input type="number" className="border rounded p-2 w-20 text-right" value={form.stock} onChange={(e) => handleChange(e, 'stock')} /></td>
                      <td className="p-2 text-center">
                          <button onClick={handleSave} className="bg-green-100 text-green-700 p-2 rounded mr-2"><Save size={18} /></button>
                          <button onClick={handleCancel} className="bg-red-100 text-red-700 p-2 rounded"><X size={18} /></button>
                      </td>
                    </tr>
                  )}
                  {db.map(prod => (
                      <tr key={prod.id} className="border-b hover:bg-blue-50 transition-colors">
                      {editando === prod.id ? (
                          <>
                          <td className="p-2"><input className="border rounded p-2 w-full font-mono" value={form.codigo} onChange={(e) => handleChange(e, 'codigo')} /></td>
                          <td className="p-2"><input className="border rounded p-2 w-full" value={form.nombre} onChange={(e) => handleChange(e, 'nombre')} /></td>
                          <td className="p-2 text-right"><input type="number" className="border rounded p-2 w-24 text-right" value={form.precio} onChange={(e) => handleChange(e, 'precio')} /></td>
                          <td className="p-2 text-right"><input type="number" className="border rounded p-2 w-20 text-right" value={form.stock} onChange={(e) => handleChange(e, 'stock')} /></td>
                          <td className="p-2 text-center">
                              <button onClick={handleSave} className="bg-green-100 text-green-700 p-2 rounded mr-2"><Save size={18} /></button>
                              <button onClick={handleCancel} className="bg-red-100 text-red-700 p-2 rounded"><X size={18} /></button>
                          </td>
                          </>
                      ) : (
                          <>
                          <td className="p-4 font-mono text-gray-500">{prod.codigo}</td>
                          <td className="p-4 font-medium">{prod.nombre}</td>
                          <td className="p-4 text-right font-bold">${prod.precio}</td>
                          <td className={`p-4 text-right font-bold ${prod.stock < 10 ? 'text-red-600' : 'text-green-700'}`}>{prod.stock}</td>
                          <td className="p-4 text-center">
                              <button onClick={() => handleEdit(prod)} className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition"><Trash2 size={16} /></button>
                          </td>
                          </>
                      )}
                      </tr>
                  ))}
                  </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-bold text-gray-800">Historial de Ventas</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDateFilter('today')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold transition">Hoy</button>
                <button onClick={() => handleDateFilter('week')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold transition">Esta Semana</button>
                <button onClick={() => handleDateFilter('month')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold transition">Este Mes</button>
                <button onClick={() => handleDateFilter('all')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold transition">Todas</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="text-gray-500 border-b bg-gray-50 text-xs uppercase font-semibold">
                      <th className="p-4">ID Venta</th><th className="p-4">Fecha y Hora</th><th className="p-4 text-center">Items</th><th className="p-4 text-right">Total</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {sales.length > 0 ? sales.map(sale => (
                      <tr key={sale.id} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="p-4 font-mono text-gray-500">#{sale.id}</td>
                        <td className="p-4">{new Date(sale.fecha).toLocaleString()}</td>
                        <td className="p-4 text-center">{sale.items_count}</td>
                        <td className="p-4 text-right font-bold text-green-600">${sale.total}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center p-16 text-gray-400">
                          <FileText size={40} className="mx-auto mb-2"/>
                          No hay ventas para el período seleccionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackOfficeView;