/* eslint-env node */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {
  getProducts,
  updateProduct,
  createSale,
} = require('./db');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // CORRECCIÓN AQUÍ:
  // Usamos !app.isPackaged para saber si estamos en modo desarrollo.
  // Esto es mucho más seguro que usar process.env.NODE_ENV
  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
    // win.webContents.openDevTools(); // Descomenta esto si quieres ver la consola (F12)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  // --- IPC Handlers ---
  ipcMain.handle('get-products', getProducts);
  ipcMain.handle('update-product', (event, product) => updateProduct(product));
  ipcMain.handle('create-sale', (event, saleData) => createSale(saleData.items, saleData.total));
  // --------------------

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});