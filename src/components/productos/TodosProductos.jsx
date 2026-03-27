import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';

const TodosProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      setProductos(data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Cargando productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">❌</span>
            <div>
              <h3 className="text-red-800 font-semibold">Error al cargar productos</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchProductos}
            className="mt-3 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#1E3A2C]">📦 Todos los Productos</h2>
        <button
          onClick={fetchProductos}
          className="bg-[#3B6A45] hover:bg-[#2C4F36] text-white px-3 py-1 rounded text-sm transition"
        >
          🔄 Actualizar
        </button>
      </div>
      
      {productos.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-gray-400 text-4xl">📦</span>
          <h3 className="text-gray-600 font-medium mt-3">No hay productos registrados</h3>
          <p className="text-gray-500 text-sm mt-1">Comienza agregando tu primer producto usando la opción "Agregar" del menú.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Nombre</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Marca</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Descripción</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Precio</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Stock</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productos.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.Nombre}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs rounded-full bg-[#4F8E62] text-white">
                      {product.Marca || 'Sin marca'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 max-w-xs truncate">{product.Descripcion}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${product.Precio}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{product.Stock}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.Estado 
                        ? 'bg-[#4F8E62] text-white' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.Estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {productos.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>Mostrando {productos.length} {productos.length === 1 ? 'producto' : 'productos'}</span>
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default TodosProductos;
