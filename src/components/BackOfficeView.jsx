import React, { useState } from 'react';
import { LayoutDashboard, ArrowLeft, Save, LogOut, TrendingUp, Package, Settings } from 'lucide-react';

const BackOfficeView = ({ db, onUpdateProduct, onBack }) => {
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setForm(producto);
  };

  const handleSave = () => {
    onUpdateProduct(form);
    setEditando(null);
  };

  const handleChange = (e, field) => {
    const val = e.target.value;
    setForm({ ...form, [field]: (field === 'precio' || field === 'stock') ? Number(val) : val });
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

        {/* Tabla Inventario */}
        <div className="bg-white rounded-lg shadow flex flex-col">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-bold text-gray-800">Inventario</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="text-gray-500 border-b bg-gray-50 text-xs uppercase font-semibold">
                    <th className="p-4">Código</th><th className="p-4">Nombre</th><th className="p-4 text-right">Precio</th><th className="p-4 text-right">Stock</th><th className="p-4 text-center">Acciones</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                {db.map(prod => (
                    <tr key={prod.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-mono text-gray-500">{prod.codigo}</td>
                    {editando === prod.id ? (
                        <>
                        <td className="p-4"><input className="border rounded p-2 w-full" value={form.nombre} onChange={(e) => handleChange(e, 'nombre')} /></td>
                        <td className="p-4 text-right"><input type="number" className="border rounded p-2 w-24 text-right" value={form.precio} onChange={(e) => handleChange(e, 'precio')} /></td>
                        <td className="p-4 text-right"><input type="number" className="border rounded p-2 w-20 text-right" value={form.stock} onChange={(e) => handleChange(e, 'stock')} /></td>
                        <td className="p-4 text-center">
                            <button onClick={handleSave} className="bg-green-100 text-green-700 p-2 rounded mr-2"><Save size={18} /></button>
                            <button onClick={() => setEditando(null)} className="bg-red-100 text-red-700 p-2 rounded"><LogOut size={18} /></button>
                        </td>
                        </>
                    ) : (
                        <>
                        <td className="p-4 font-medium">{prod.nombre}</td>
                        <td className="p-4 text-right font-bold">${prod.precio}</td>
                        <td className={`p-4 text-right font-bold ${prod.stock < 10 ? 'text-red-600' : 'text-green-700'}`}>{prod.stock}</td>
                        <td className="p-4 text-center"><button onClick={() => handleEdit(prod)} className="text-blue-600 hover:underline">Editar</button></td>
                        </>
                    )}
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackOfficeView;