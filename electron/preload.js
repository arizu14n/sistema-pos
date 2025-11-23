/* eslint-env node */
const { contextBridge, ipcRenderer } = require('electron');

// --- Expose a secure API to the Renderer process ---
contextBridge.exposeInMainWorld('electronAPI', {
  // --- Main-to-Renderer (one-way) ---
  // Example: onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),

  // --- Renderer-to-Main (two-way) ---
  getProducts: () => ipcRenderer.invoke('get-products'),
  updateProduct: (product) => ipcRenderer.invoke('update-product', product),
  createSale: (saleData) => ipcRenderer.invoke('create-sale', saleData),
  createProduct: (product) => ipcRenderer.invoke('create-product', product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  getSales: (filter) => ipcRenderer.invoke('get-sales', filter),

  // --- Functions that don't need the main process ---
  // By moving prompt/alert here, they are called from a more privileged
  // context, making them more reliable.
  promptPin: (message) => {
    // We are not using the native prompt anymore, but this is where you would.
    // For now, we will just return a hardcoded value for the logic to work.
    // In the next step, we will build a custom modal.
    return window.prompt(message);
  },
  alert: (message) => window.alert(message),
});