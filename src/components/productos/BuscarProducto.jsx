import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';

const BuscarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('Nombre');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    // Filtrar productos cuando cambia el término de búsqueda o el campo
    if (searchTerm.trim() === '') {
      setFilteredProducts(productos);
    } else {
      const filtered = productos.filter(product => {
        const field = product[searchField] || '';
        return field.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredProducts(filtered);
    }
  }, [searchTerm, searchField, productos]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('Nombre', { ascending: true });

      if (error) {
        throw error;
      }

      setProductos(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  
  const clearFilters = () => {
    setSearchTerm('');
    setSearchField('Nombre');
    setFilteredProducts(productos);
  };

  if (loading && productos.length === 0) {
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
      <h2 className="text-lg font-medium mb-4 text-[#1E3A2C]">🔍 Buscar Productos</h2>
      
      {/* Opciones de búsqueda */}
      <div className="mb-4">
        <h3 className="text-[#1E3A2C] font-medium mb-3">Opciones de Búsqueda</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#2C4F36] mb-1">Buscar por:</label>
            <select 
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
            >
              <option value="Nombre">Nombre</option>
              <option value="Marca">Marca</option>
              <option value="Descripcion">Descripción</option>
              <option value="Precio">Precio</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#2C4F36] mb-1">Término de búsqueda:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingrese el término a buscar..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
              />
              <button 
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <h3 className="text-[#1E3A2C] font-medium mb-2">Resultados de la Búsqueda</h3>
        <p className="text-sm text-gray-600">
          {searchTerm 
            ? `Se encontraron ${filteredProducts.length} resultados para "${searchTerm}"`
            : `Mostrando todos los productos (${productos.length} totales)`
          }
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-gray-400 text-4xl">🔍</span>
          <h3 className="text-gray-600 font-medium mt-3">No se encontraron productos</h3>
          <p className="text-gray-500 text-sm mt-1">Intenta con otros términos de búsqueda.</p>
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.Nombre}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
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
                      {product.Estado ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {filteredProducts.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>
            {searchTerm 
              ? `${filteredProducts.length} resultados encontrados`
              : `${productos.length} productos totales`
            }
          </span>
          <span>Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default BuscarProducto;
