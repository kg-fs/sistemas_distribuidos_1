import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';

// Importar componentes de productos
import TodosProductos from './productos/TodosProductos.jsx';
import AgregarProducto from './productos/AgregarProducto.jsx';
import DarBajaProducto from './productos/DarBajaProducto.jsx';
import ModificarProducto from './productos/ModificarProducto.jsx';
import BuscarProducto from './productos/BuscarProducto.jsx';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('todos');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check current user
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          window.location.href = '/';
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const renderActiveComponent = () => {
    switch(activeView) {
      case 'agregar':
        return <AgregarProducto />;
      case 'todos':
        return <TodosProductos />;
      case 'darbaja':
        return <DarBajaProducto />;
      case 'modificar':
        return <ModificarProducto />;
      case 'buscar':
        return <BuscarProducto />;
      default:
        return <AgregarProducto />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D5F2D8]">
      {/* Header con menú desplegable */}
      <header className="bg-[#1E3A2C] text-white shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">📋SISTEMA DE CONTROL DE INVENTARIO</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Bienvenido, {user?.email || 'Usuario'}</span>
              <button
                onClick={handleLogout}
                className="bg-[#3B6A45] hover:bg-[#2C4F36] text-white px-3 py-1 rounded-md text-sm transition"
              >
                Cerrar Sesión
              </button>
              
              {/* Menú desplegable */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="bg-[#B3E5C1] hover:bg-[#6EAD7B] text-white px-3 py-1 rounded-md text-sm transition flex items-center"
                >
                  <span>🎯 Menú</span>
                  <span className={`ml-2 transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                
                {/* Menú desplegado */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#8FCCA3] z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { setActiveView('agregar'); setMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-md transition ${
                          activeView === 'agregar' 
                            ? 'bg-[#4F8E62] text-white' 
                            : 'hover:bg-[#B3E5C1] text-black'
                        }`}
                      >
                        📝 Agregar
                      </button>
                      <button
                        onClick={() => { setActiveView('todos'); setMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-md transition ${
                          activeView === 'todos' 
                            ? 'bg-[#4F8E62] text-white' 
                            : 'hover:bg-[#B3E5C1] text-black'
                        }`}
                      >
                        📦 Ver Todos
                      </button>
                      <button
                        onClick={() => { setActiveView('darbaja'); setMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-md transition ${
                          activeView === 'darbaja' 
                            ? 'bg-[#4F8E62] text-white' 
                            : 'hover:bg-[#B3E5C1] text-black'
                        }`}
                      >
                        🔕 Dar de Baja
                      </button>
                      <button
                        onClick={() => { setActiveView('modificar'); setMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-md transition ${
                          activeView === 'modificar' 
                            ? 'bg-[#4F8E62] text-white' 
                            : 'hover:bg-[#B3E5C1] text-black'
                        }`}
                      >
                        ✏️ Modificar
                      </button>
                      <button
                        onClick={() => { setActiveView('buscar'); setMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 rounded-md transition ${
                          activeView === 'buscar' 
                            ? 'bg-[#4F8E62] text-white' 
                            : 'hover:bg-[#B3E5C1] text-black'
                        }`}
                      >
                        🔍 Buscar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - solo el componente activo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-black">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
