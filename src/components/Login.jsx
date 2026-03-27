import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      showMessage('¡Sesión iniciada correctamente!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      showMessage(error.message, true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword
      });
      
      if (error) throw error;
      
      showMessage('¡Cuenta creada! Revisa tu email para confirmar.');
      setShowRegister(false);
      setRegEmail('');
      setRegPassword('');
    } catch (error) {
      showMessage(error.message, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#D5F2D8] flex items-center justify-center">
      <div className="max-w-md w-full p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-[#1E3A2C] mb-6 text-center">SISTEMA DE CONTROL DE INVENTARIO</h2>
          
          {message && (
            <div className={`p-3 mb-4 rounded-md ${
              isError
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
              {message}
            </div>
          )}

          {!showRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#3B6A45] hover:bg-[#2C4F36] text-white py-2 px-4 rounded-md transition"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C4F36] mb-1">Contraseña</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="•••••"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4F8E62] focus:border-[#4F8E62]"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#3B6A45] hover:bg-[#2C4F36] text-white py-2 px-4 rounded-md transition"
                >
                  Registrarse
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition mt-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
          
          {!showRegister && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>¿No tienes cuenta?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-[#3B6A45] hover:text-[#2C4F36] font-medium"
                >
                  Registrarse
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
