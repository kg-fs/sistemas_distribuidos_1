import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';

const ModificarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [precio, setPrecio] = useState('');
  const [estado, setEstado] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const product = productos.find(p => p.id === parseInt(selectedProduct));
      if (product) {
        setNombre(product.Nombre || '');
        setMarca(product.Marca || '');
        setPrecio(product.Precio?.toString() || '');
        setEstado(product.Estado ?? true);
        setDescripcion(product.Descripcion || '');
        setStock(product.Stock?.toString() || '');
      }
    } else {
      // Limpiar formulario cuando no hay producto seleccionado
      setNombre('');
      setMarca('');
      setPrecio('');
      setEstado(true);
      setDescripcion('');
      setStock('');
    }
  }, [selectedProduct, productos]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setMessage('Por favor, seleccione un producto para modificar');
      setMessageType('error');
      return;
    }

    // Validaciones
    if (!nombre.trim() || !marca.trim() || !precio || !descripcion.trim() || stock === '') {
      setMessage('Por favor, complete todos los campos');
      setMessageType('error');
      return;
    }

    if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
      setMessage('El precio debe ser un número mayor a 0');
      setMessageType('error');
      return;
    }

    if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      setMessage('El stock debe ser un número entero mayor o igual a 0');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('productos')
        .update({
          Nombre: nombre.trim(),
          Marca: marca.trim(),
          Precio: parseFloat(precio),
          Estado: estado,
          Descripcion: descripcion.trim(),
          Stock: parseInt(stock)
        })
        .eq('id', parseInt(selectedProduct));

      if (error) {
        throw error;
      }

      setMessage('¡Producto actualizado exitosamente!');
      setMessageType('success');
      
      // Recargar lista de productos
      await fetchProductos();

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4">
      <h2 className="text-lg font-medium mb-4 text-[#1E3A2C]">✏️ Modificar Producto</h2>
      
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
        <label className="block text-sm font-medium text-[#2C4F36] mb-1">Seleccione un producto para modificar:</label>
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
        <>
          <div className="mb-4">
            <p className="text-[#1E3A2C] text-sm">📝 Modifique los campos que desee actualizar</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Marca *</label>
                <input
                  type="text"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Stock *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Descripción *</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Estado</label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={estado}
                      onChange={(e) => setEstado(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-[#4F8E62]"
                    />
                    <span className="ml-2 text-sm text-[#2C4F36]">Activo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3B6A45] hover:bg-[#2C4F36] text-white px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Actualizando...' : 'Actualizar Producto'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct('');
                  setMessage('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </>
      )}

      {!selectedProduct && (
        <div className="text-center py-12">
          <span className="text-gray-500 text-lg">📋</span>
          <p className="text-gray-600 mt-2">Seleccione un producto de la lista para comenzar a editarlo</p>
        </div>
      )}
    </div>
  );
};

export default ModificarProducto;
