const Database = require('better-sqlite3');
const path = require('path');

// Ubicar la DB en la raíz del proyecto para que la veas fácil
const dbPath = path.join(__dirname, '..', 'kiosco.db');

console.log('\n\n==================================================');
console.log('📂 BASE DE DATOS UBICADA EN:', dbPath);
console.log('==================================================\n\n');

const db = new Database(dbPath, { verbose: console.log });

const initDB = () => {
  // Tabla Productos
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT UNIQUE,
      nombre TEXT,
      precio INTEGER,
      stock INTEGER,
      categoria TEXT
    )
  `);

  // Tabla Ventas
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT,
      total INTEGER,
      items_count INTEGER
    )
  `);

  // Datos de prueba si está vacía
  const count = db.prepare('SELECT count(*) as count FROM products').get();
  if (count.count === 0) {
    console.log('⚠️ TABLA VACÍA: Insertando datos de prueba...');
    const insert = db.prepare('INSERT INTO products (codigo, nombre, precio, stock, categoria) VALUES (@codigo, @nombre, @precio, @stock, @categoria)');
    const initialData = [
      { codigo: '779123', nombre: 'Coca Cola 2.25L', precio: 1800, stock: 50, categoria: 'Bebidas' },
      { codigo: '779456', nombre: 'Galletitas Oreo', precio: 1200, stock: 30, categoria: 'Almacén' },
      { codigo: '779789', nombre: 'Pan Lactal', precio: 2500, stock: 15, categoria: 'Panadería' },
      { codigo: '1001', nombre: 'Caramelos sueltos x100g', precio: 500, stock: 100, categoria: 'Kiosco' },
      { codigo: '2002', nombre: 'Cerveza Quilmes 1L', precio: 2100, stock: 24, categoria: 'Bebidas' }
    ];
    const insertMany = db.transaction((products) => {
      for (const prod of products) insert.run(prod);
    });
    insertMany(initialData);
  }
};

// Funciones exportadas
const getProducts = () => db.prepare('SELECT * FROM products').all();
const updateProduct = (p) => db.prepare('UPDATE products SET nombre = @nombre, precio = @precio, stock = @stock WHERE id = @id').run(p);
const createSale = (items, total) => {
  const transaction = db.transaction(() => {
    db.prepare('INSERT INTO sales (fecha, total, items_count) VALUES (?, ?, ?)').run(new Date().toISOString(), total, items.length);
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    items.forEach(item => updateStock.run(item.cantidad, item.id));
  });
  transaction();
  return true;
};


// Nueva función: Obtener historial de ventas (últimas 50)
const getSales = () => {
  return db.prepare('SELECT * FROM sales ORDER BY id DESC LIMIT 50').all();
};

initDB();

// Asegúrate de exportar la nueva función al final del archivo:
module.exports = {
  getProducts,
  updateProduct,
  createSale,
  getSales };