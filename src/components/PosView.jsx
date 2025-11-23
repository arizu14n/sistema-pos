import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Trash2, DollarSign, Package, Settings, Plus, Minus } from 'lucide-react';

const PosView = ({ db, onProcessSale, onOpenAdmin }) => {
  const [query, setQuery] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setTotal(carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0));
  }, [carrito]);

  useEffect(() => {
    if(searchInputRef.current) searchInputRef.current.focus();
  }, [carrito, query]); 

  const agregarProducto = (producto) => {
    if (producto.stock <= 0) return alert("¡Sin Stock!");
    
    setCarrito(prev => {
      const existente = prev.find(item => item.id === producto.id);
      if (existente) return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setQuery('');
  };

  const restarCantidad = (id) => {
    setCarrito(prev => prev.map(item => {
        if (item.id === id) return { ...item, cantidad: item.cantidad - 1 };
        return item;
    }).filter(item => item.cantidad > 0));
  };

  const manejarCobro = () => {
    onProcessSale(carrito, total);
    setCarrito([]);
  };

  const manejarBusqueda = (e) => {
    const val = e.target.value;
    setQuery(val);
    const exactMatch = db.find(p => p.codigo === val);
    if (exactMatch) agregarProducto(exactMatch);
  };

  const resultadosBusqueda = query.length > 0 
    ? db.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()) && p.codigo !== query)
    : [];

  return (
    <div className="flex h-screen bg-gray-200 font-sans overflow-hidden">
      {/* SECCIÓN IZQUIERDA: BUSCADOR */}
      <div className="w-2/3 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Mi Kiosco</h1>
                <p className="text-gray-500 text-sm">Caja Principal • Turno Mañana</p>
            </div>
            <button onClick={onOpenAdmin} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition">
                <Settings size={16} /> Administración
            </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={24} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={manejarBusqueda}
              placeholder="Escanear código o escribir nombre..."
              className="w-full pl-12 pr-4 py-3 text-xl font-medium text-gray-800 bg-gray-50 border-2 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-3 gap-3">
            {resultadosBusqueda.length > 0 ? (
              resultadosBusqueda.map(prod => (
                <button key={prod.id} onClick={() => agregarProducto(prod)} className="p-4 border border-gray-100 bg-white rounded-xl hover:border-blue-500 hover:shadow-md transition flex flex-col items-center text-center group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
                  <Package size={28} className="text-gray-400 mb-2 group-hover:text-blue-500 transition" />
                  <span className="font-bold text-gray-700 text-sm leading-tight line-clamp-2 h-10 flex items-center">{prod.nombre}</span>
                  <span className="text-blue-600 font-bold text-lg mt-1">${prod.precio}</span>
                  <span className="text-xs text-gray-400 mt-1">Stock: {prod.stock}</span>
                </button>
              ))
            ) : (
              <div className="col-span-3 h-64 flex flex-col items-center justify-center text-gray-300">
                <Search size={48} className="mb-4 opacity-50"/>
                <p className="text-lg font-medium">Listo para vender</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: TICKET */}
      <div className="w-1/3 bg-white flex flex-col h-full shadow-2xl z-10 border-l border-gray-200">
        <div className="p-5 bg-blue-600 text-white shadow-md">
          <div className="flex justify-between items-center mb-1">
             <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20}/> Ticket de Venta</h2>
             <span className="bg-blue-800 text-blue-100 px-2 py-0.5 rounded text-xs font-mono">#0001-492</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
            <div className="space-y-2">
                {carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm group hover:border-blue-200 transition">
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-gray-800 text-sm truncate">{item.nombre}</p>
                        <p className="text-xs text-gray-500">${item.precio} x unidad</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                            <button onClick={() => restarCantidad(item.id)} className="p-1 hover:bg-gray-200 hover:text-red-600 rounded-l-lg transition"><Minus size={14} /></button>
                            <span className="w-8 text-center font-bold text-sm text-gray-800">{item.cantidad}</span>
                            <button onClick={() => agregarProducto(item)} className="p-1 hover:bg-gray-200 hover:text-green-600 rounded-r-lg transition"><Plus size={14} /></button>
                        </div>
                        <span className="font-mono font-bold text-gray-900 w-16 text-right">${item.precio * item.cantidad}</span>
                        <button onClick={() => setCarrito(prev => prev.filter(i => i.id !== item.id))} className="text-gray-300 hover:text-red-500 transition p-1 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
            </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total a Pagar</span>
            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">${total}</span>
          </div>
          <button onClick={manejarCobro} disabled={carrito.length === 0} className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-green-200 transform active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            <DollarSign size={24} strokeWidth={3} /> COBRAR (F1)
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosView;