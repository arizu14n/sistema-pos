import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Trash2, CreditCard, DollarSign, Package, LayoutDashboard, ArrowLeft, Save, Settings, LogOut, TrendingUp, Plus, Minus } from 'lucide-react';

// --- BASE DE DATOS LOCAL SIMULADA (SQLite) ---
const INITIAL_DB = [
  { id: 1, codigo: '779123', nombre: 'Coca Cola 2.25L', precio: 1800, stock: 50, categoria: 'Bebidas' },
  { id: 2, codigo: '779456', nombre: 'Galletitas Oreo', precio: 1200, stock: 30, categoria: 'Almacén' },
  { id: 3, codigo: '779789', nombre: 'Pan Lactal', precio: 2500, stock: 15, categoria: 'Panadería' },
  { id: 4, codigo: '1001', nombre: 'Caramelos sueltos x100g', precio: 500, stock: 100, categoria: 'Kiosco' },
  { id: 5, codigo: '2002', nombre: 'Cerveza Quilmes 1L', precio: 2100, stock: 24, categoria: 'Bebidas' },
];

// --- COMPONENTE: BACKOFFICE (Administración) ---
const BackOffice = ({ db, setDb, onBack }) => {
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [ventasDia, setVentasDia] = useState(154300); 

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setForm(producto);
  };

  const handleSave = () => {
    setDb(prev => prev.map(p => p.id === form.id ? form : p));
    setEditando(null);
  };

  const handleChange = (e, field) => {
    const val = e.target.value;
    setForm({ 
        ...form, 
        [field]: (field === 'precio' || field === 'stock') ? Number(val) : val 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-blue-400" /> Panel de Control
        </h2>
        <div className="flex gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs text-gray-400">Usuario</p>
                <p className="font-bold text-sm">Admin Principal</p>
             </div>
            <button onClick={onBack} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex items-center gap-2 transition font-bold shadow">
            <ArrowLeft size={18} /> Volver a Vender
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Ventas Hoy</p>
                    <p className="text-2xl font-bold text-gray-800">${ventasDia.toLocaleString()}</p>
                </div>
                <TrendingUp className="text-green-500" size={32}/>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Productos Activos</p>
                    <p className="text-2xl font-bold text-gray-800">{db.length}</p>
                </div>
                <Package className="text-blue-500" size={32}/>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Stock Crítico</p>
                    <p className="text-2xl font-bold text-gray-800">{db.filter(p => p.stock < 10).length}</p>
                </div>
                <Settings className="text-orange-500" size={32}/>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow flex flex-col">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
            <div>
                <h3 className="text-lg font-bold text-gray-800">Inventario</h3>
                <p className="text-sm text-gray-500">Edita precios y stock directamente aquí.</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-bold shadow-sm">
              + Nuevo Producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="text-gray-500 border-b bg-gray-50 text-xs uppercase font-semibold tracking-wider">
                    <th className="p-4">Código</th>
                    <th className="p-4">Nombre del Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-right">Precio ($)</th>
                    <th className="p-4 text-right">Stock (Un.)</th>
                    <th className="p-4 text-center">Acciones</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                {db.map(prod => (
                    <tr key={prod.id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-mono text-gray-500">{prod.codigo}</td>
                    
                    {editando === prod.id ? (
                        <>
                        <td className="p-4"><input className="border border-blue-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-200 outline-none" value={form.nombre} onChange={(e) => handleChange(e, 'nombre')} autoFocus /></td>
                        <td className="p-4"><input className="border border-blue-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-200 outline-none" value={form.categoria} onChange={(e) => handleChange(e, 'categoria')} /></td>
                        <td className="p-4 text-right"><input type="number" className="border border-blue-300 rounded p-2 w-24 text-right focus:ring-2 focus:ring-blue-200 outline-none font-bold" value={form.precio} onChange={(e) => handleChange(e, 'precio')} /></td>
                        <td className="p-4 text-right"><input type="number" className="border border-blue-300 rounded p-2 w-20 text-right focus:ring-2 focus:ring-blue-200 outline-none" value={form.stock} onChange={(e) => handleChange(e, 'stock')} /></td>
                        <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                                <button onClick={handleSave} className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200 transition" title="Guardar"><Save size={18} /></button>
                                <button onClick={() => setEditando(null)} className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition" title="Cancelar"><LogOut size={18} /></button>
                            </div>
                        </td>
                        </>
                    ) : (
                        <>
                        <td className="p-4 font-medium text-gray-900">{prod.nombre}</td>
                        <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{prod.categoria}</span></td>
                        <td className="p-4 text-right font-bold text-gray-800 text-base">${prod.precio}</td>
                        <td className={`p-4 text-right font-bold ${prod.stock < 10 ? 'text-red-600 bg-red-50 rounded' : 'text-green-700'}`}>{prod.stock}</td>
                        <td className="p-4 text-center">
                            <button onClick={() => handleEdit(prod)} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">Editar</button>
                        </td>
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

// --- COMPONENTE: POS (Punto de Venta) ---
const POS = ({ db, setDb, onOpenAdmin }) => {
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
      // Sumamos 1 a la cantidad si ya existe
      if (existente) return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setQuery('');
  };

  // Función para restar cantidad (si llega a 0 se elimina)
  const restarCantidad = (id) => {
    setCarrito(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
    }).filter(item => item.cantidad > 0)); // Filtro mágico: elimina si cantidad es 0
  };

  // Función para sumar cantidad manualmente desde el ticket
  const sumarCantidad = (id) => {
    // Aquí deberíamos chequear stock de nuevo idealmente
    setCarrito(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
    }));
  };

  const procesarVenta = () => {
    const nuevoDb = db.map(producto => {
        const vendido = carrito.find(item => item.id === producto.id);
        if (vendido) {
            return { ...producto, stock: producto.stock - vendido.cantidad };
        }
        return producto;
    });

    setDb(nuevoDb); 
    setCarrito([]); 
    alert(`Venta por $${total} registrada. Stock actualizado.`);
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
      
      {/* COLUMNA IZQUIERDA: Buscador y Catálogo */}
      <div className="w-2/3 p-4 flex flex-col gap-4">
        {/* Cabecera POS */}
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
                <button 
                    key={prod.id} 
                    onClick={() => agregarProducto(prod)} 
                    className="p-4 border border-gray-100 bg-white rounded-xl hover:border-blue-500 hover:shadow-md transition flex flex-col items-center text-center group relative overflow-hidden"
                >
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
                <p className="text-sm">Escanea un producto para empezar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: Ticket */}
      <div className="w-1/3 bg-white flex flex-col h-full shadow-2xl z-10 border-l border-gray-200">
        <div className="p-5 bg-blue-600 text-white shadow-md">
          <div className="flex justify-between items-center mb-1">
             <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20}/> Ticket de Venta</h2>
             <span className="bg-blue-800 text-blue-100 px-2 py-0.5 rounded text-xs font-mono">#0001-492</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
              <p className="text-sm font-medium">El carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-2">
                {carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm group hover:border-blue-200 transition">
                    
                    {/* Nombre y Precio Unitario */}
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-gray-800 text-sm truncate">{item.nombre}</p>
                        <p className="text-xs text-gray-500">${item.precio} x unidad</p>
                    </div>

                    {/* Controles de Cantidad y Total */}
                    <div className="flex items-center gap-3">
                        {/* Selector de Cantidad */}
                        <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                            <button 
                                onClick={() => restarCantidad(item.id)}
                                className="p-1 hover:bg-gray-200 hover:text-red-600 rounded-l-lg transition"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold text-sm text-gray-800">{item.cantidad}</span>
                            <button 
                                onClick={() => sumarCantidad(item.id)}
                                className="p-1 hover:bg-gray-200 hover:text-green-600 rounded-r-lg transition"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Total del item */}
                        <span className="font-mono font-bold text-gray-900 w-16 text-right">${item.precio * item.cantidad}</span>
                        
                        {/* Botón Eliminar Directo */}
                        <button 
                            onClick={() => setCarrito(prev => prev.filter(i => i.id !== item.id))} 
                            className="text-gray-300 hover:text-red-500 transition p-1 hover:bg-red-50 rounded"
                            title="Quitar del ticket"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Zona de Totales y Pago */}
        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Total a Pagar</span>
            <span className="text-5xl font-extrabold text-gray-900 tracking-tight">${total}</span>
          </div>
          
          <button 
            onClick={procesarVenta}
            disabled={carrito.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-green-200 transform active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <DollarSign size={24} strokeWidth={3} /> COBRAR (F1)
          </button>
          
          <div className="mt-3 flex gap-2">
             <button disabled={carrito.length === 0} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition">Tarjeta</button>
             <button disabled={carrito.length === 0} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition">QR / Apps</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [view, setView] = useState('pos'); 
  const [db, setDb] = useState(INITIAL_DB); 

  return (
    <>
      {view === 'pos' ? (
        <POS db={db} setDb={setDb} onOpenAdmin={() => setView('backoffice')} />
      ) : (
        <BackOffice db={db} setDb={setDb} onBack={() => setView('pos')} />
      )}
    </>
  );
};

export default App;