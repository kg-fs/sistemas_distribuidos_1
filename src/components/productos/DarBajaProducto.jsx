import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';

const DarBajaProducto = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('Nombre', { ascending: true });

      if (error) {
        throw error;
      }

      setProductos(data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    }
  };

  const handleDeactivate = async () => {
    if (!selectedProduct) {
      setMessage('Por favor, seleccione un producto para dar de baja');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('productos')
        .update({ Estado: false })  // Solo cambia el estado a Inactivo
        .eq('id', parseInt(selectedProduct));

      if (error) {
        throw error;
      }

      setMessage('¡Producto dado de baja exitosamente! (Estado: Inactivo)');
      setMessageType('success');
      
      // Limpiar y recargar
      setSelectedProduct('');
      await fetchProductos();

    } catch (error) {
      console.error('Error al dar de baja producto:', error);
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getProductData = () => {
    return productos.find(p => p.id === parseInt(selectedProduct)) || {};
  };

  const productData = getProductData();

  return (
    <div className="bg-white p-4">
      <h2 className="text-lg font-medium mb-4 text-[#1E3A2C]">🔕 Dar de Baja Producto</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#2C4F36] mb-1">Seleccione un producto para dar de baja:</label>
        <select 
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
        >
          <option value="">-- Seleccione un producto --</option>
          {productos.map((product) => (
            <option key={product.id} value={product.id}>
              {product.Nombre} - {product.Marca || 'Sin marca'} - ${product.Precio}
            </option>
          ))}
        </select>
      </div>
      
      {selectedProduct && (
        <div className="mb-4">
          <h3 className="text-[#1E3A2C] font-medium mb-3">Información del Producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-gray-900">{productData.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Nombre:</span>
              <span className="ml-2 text-gray-900">{productData.Nombre}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Marca:</span>
              <span className="ml-2 text-gray-900">{productData.Marca || 'Sin marca'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Precio:</span>
              <span className="ml-2 text-gray-900">${productData.Precio}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Stock actual:</span>
              <span className="ml-2 text-gray-900">{productData.Stock}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Estado:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                productData.Estado 
                  ? 'bg-[#4F8E62] text-white' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {productData.Estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleDeactivate}
          disabled={!selectedProduct || loading}
          className="bg-[#3B6A45] hover:bg-[#2C4F36] text-white px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : 'Confirmar Dar de Baja'}
        </button>
        <button
          onClick={() => {
            setSelectedProduct('');
            setMessage('');
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DarBajaProducto;
