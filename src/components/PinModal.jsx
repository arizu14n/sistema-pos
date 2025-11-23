import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const PinModal = ({ onPinSubmit, onCancel }) => {
  const [pin, setPin] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the hidden input when the modal opens
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = (key) => {
    if (pin.length < 4) {
      setPin(pin + key);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPinSubmit(pin);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-80 text-center relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Acceso de Administrador</h2>
        <p className="text-gray-500 mb-6">Ingrese su PIN para continuar.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-10 h-12 rounded-lg border-2 ${pin.length > i ? 'bg-blue-500 border-blue-500' : 'bg-gray-100 border-gray-300'}`}></div>
            ))}
          </div>
          {/* Hidden input to capture keyboard events and maintain focus */}
          <input ref={inputRef} type="password" value={pin} readOnly className="opacity-0 absolute" />
        </form>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleKeyPress(num.toString())} className="p-4 bg-gray-100 rounded-lg text-2xl font-bold text-gray-700 hover:bg-gray-200 transition active:scale-95">
              {num}
            </button>
          ))}
          <button onClick={handleDelete} className="p-4 bg-gray-100 rounded-lg text-xl font-bold text-gray-700 hover:bg-gray-200 transition active:scale-95">Borrar</button>
          <button onClick={() => handleKeyPress('0')} className="p-4 bg-gray-100 rounded-lg text-2xl font-bold text-gray-700 hover:bg-gray-200 transition active:scale-95">0</button>
          <button onClick={handleSubmit} className="p-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-500 transition active:scale-95">Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;