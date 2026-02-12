import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  User, // ← ESTABA FALTANDO ESTA IMPORTACIÓN
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Trash2,
  ChevronRight,
  Shield
} from 'lucide-react';
import { AuthService } from '../lib/axios/crud';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Toaster } from "react-hot-toast";


// ========== Tipos estrictos ==========
interface FormData {
  usuario: string;
  password: string;
  rememberMe: boolean;
}

interface Errors {
  usuario: string;
  password: string;
}

// ========== Componente ==========
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedUser, setSavedUser] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    usuario: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Errors>({
    usuario: '',
    password: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('rememberedUser');
    if (storedUser) {
      setSavedUser(storedUser);
      setFormData(prev => ({
        ...prev,
        usuario: storedUser,
        rememberMe: true
      }));
    }
  }, []);

  const formatUsuario = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      if (numbers.length <= 4) return numbers;
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
    } else {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 10)}-${numbers.slice(10, 11)}`;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;

    if (name === 'usuario') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
        const formatted = formatUsuario(value);
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      if (savedUser && value !== savedUser) {
        setSavedUser('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Errors = { usuario: '', password: '' };

    if (!formData.usuario) {
      newErrors.usuario = 'El usuario es requerido';
      isValid = false;
    } else {
      const numbersOnly = formData.usuario.replace(/\D/g, '');
      if (numbersOnly.length !== 8 && numbersOnly.length !== 11) {
        newErrors.usuario = 'El usuario debe tener 8 u 11 dígitos';
        isValid = false;
      }
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const data:any = await AuthService.login(formData.usuario, formData.password);
    if(data === 'Invalid User') {
      toast.error('Usuario o contraseña incorrectos');
      setIsLoading(false);
      return;
    }
    Cookies.set('accessToken', data.accesToken);
    toast.success('Sesión iniciada exitosamente');
    if (formData.rememberMe) {
      localStorage.setItem('rememberedUser', formData.usuario);
      setSavedUser(formData.usuario);
    } else {
      localStorage.removeItem('rememberedUser');
      setSavedUser('');
    }
    setIsLoading(false);
  };

  const clearSavedUser = (): void => {
    localStorage.removeItem('rememberedUser');
    setSavedUser('');
    setFormData(prev => ({
      ...prev,
      usuario: '',
      rememberMe: false
    }));
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen font-sans antialiased flex items-center justify-center p-4 relative overflow-hidden selection:bg-gray-300 selection:text-gray-900">
        {/* Fondo: imagen desde public con overlay oscuro */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/fondo-instituto.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80" />
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
        </div>

        {/* Contenedor principal */}
        <div className="w-full max-w-sm relative z-10">
          {/* Cabecera institucional - con logo desde public */}
          <div className="text-center mb-6">
            <div className="relative inline-flex">
              <div className="absolute inset-0  rounded-full" />
              <div className="relative inline-flex items-center justify-center w-34 h-34 rounded-2xl transform transition-all duration-300 hover:scale-110 p-3">
                <img
                  src="/logo.png"
                  alt="Instituto Biblico Verbo Divino"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-light text-white mb-1 tracking-tight drop-shadow-lg">
              Instituto Biblico Verbo Divino
            </h1>
            <p className="text-sm text-gray-200 font-medium flex items-center justify-center gap-1.5 drop-shadow-lg">
              <Shield className="w-4 h-4 text-gray-300" />
              Portal de Acceso Seguro
            </p>
          </div>

          {/* Tarjeta de acceso */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-400/20 via-white/20 to-gray-400/20 rounded-3xl blur-xl opacity-70" />
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/30 border border-white/50 p-6 transition-all duration-500 hover:bg-white/95 hover:shadow-3xl hover:border-white/60">
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 rounded-full" />
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campo Usuario */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full shadow-sm" />
                      Usuario
                    </label>
                    {savedUser && (
                      <button
                        type="button"
                        onClick={clearSavedUser}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-500 hover:text-white bg-transparent hover:bg-gray-800 rounded-lg transition-all duration-200 group"
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                        Limpiar
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-gray-700 transition-all duration-200 group-focus-within:scale-110" />
                    </div>
                    <input
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`
                        w-full pl-11 pr-4 py-3 text-gray-800 text-sm
                        border-2 ${
                          errors.usuario
                            ? 'border-gray-400 bg-white focus:border-gray-600 focus:ring-gray-400/30'
                            : 'border-gray-200/80 bg-white focus:border-gray-700 focus:ring-gray-400/20'
                        }
                        rounded-xl focus:outline-none focus:ring-4 transition-all duration-200
                        placeholder:text-gray-400 placeholder:text-sm placeholder:font-light
                        disabled:bg-gray-100/80 disabled:text-gray-500
                        shadow-sm hover:shadow-md focus:shadow-lg
                      `}
                      placeholder="Escribir Usuario"
                      aria-invalid={!!errors.usuario}
                      aria-describedby="usuario-error"
                    />
                  </div>
                  {errors.usuario && (
                    <p
                      id="usuario-error"
                      className="text-xs text-gray-700 font-medium flex items-center gap-1.5 pl-1"
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full animate-pulse" />
                      {errors.usuario}
                    </p>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full shadow-sm" />
                    Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-700 transition-all duration-200 group-focus-within:scale-110" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`
                        w-full pl-11 pr-11 py-3 text-gray-800 text-sm
                        border-2 ${
                          errors.password
                            ? 'border-gray-400 bg-white focus:border-gray-600 focus:ring-gray-400/30'
                            : 'border-gray-200/80 bg-white focus:border-gray-700 focus:ring-gray-400/20'
                        }
                        rounded-xl focus:outline-none focus:ring-4 transition-all duration-200
                        placeholder:text-gray-400 placeholder:text-sm placeholder:font-light
                        disabled:bg-gray-100/80 disabled:text-gray-500
                        shadow-sm hover:shadow-md focus:shadow-lg
                      `}
                      placeholder="Escribir Contraseña"
                      aria-invalid={!!errors.password}
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-xl"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-800 transition-all duration-200 hover:scale-110" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-800 transition-all duration-200 hover:scale-110" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-xs text-gray-700 font-medium flex items-center gap-1.5 pl-1"
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-gray-700 rounded-full animate-pulse" />
                      {errors.password}
                    </p>
                  )}
                </div>

                  <div className="flex items-center gap-2 cursor-pointer group">
                  {/* Checkbox personalizado */}
                  <div className="relative flex items-center justify-center">
                      <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="sr-only" // Oculta el checkbox nativo pero mantiene su funcionalidad
                      />
                      <div
                      className={`
                          w-5 h-5 border-2 rounded-md 
                          transition-all duration-200 ease-in-out
                          flex items-center justify-center
                          ${
                          formData.rememberMe
                              ? 'bg-gray-800 border-gray-800 hover:bg-gray-700 hover:border-gray-700'
                              : 'bg-white border-gray-300 hover:border-gray-500'
                          }
                          ${!formData.rememberMe && 'group-hover:border-gray-500'}
                          shadow-sm group-hover:shadow
                      `}
                      onClick={() => {
                          const event = {
                          target: {
                              name: 'rememberMe',
                              type: 'checkbox',
                              checked: !formData.rememberMe
                          }
                          } as ChangeEvent<HTMLInputElement>;
                          handleInputChange(event);
                      }}
                      >
                      {formData.rememberMe && (
                          <svg
                          className="w-3.5 h-3.5 text-white animate-check"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          >
                          <polyline points="20 6 9 17 4 12" />
                          </svg>
                      )}
                      </div>
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-medium select-none">
                      Recordar mi usuario
                  </span>
                  </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white text-sm font-semibold rounded-xl shadow-lg shadow-black/30 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600 flex items-center justify-center gap-2 group mt-3 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      {savedUser ? 'Ingresar' : 'Iniciar Sesión'}
                    </>
                  )}
                </button>
              </form>

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-gray-300/50 via-gray-500/50 to-gray-300/50 rounded-full" />
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3 drop-shadow-lg">
            © 2026 Instituto Bíblico Verbo Divino
          </p>
        </div>

        <style>{`
          .bg-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
            background-repeat: repeat;
          }
        `}</style>
      </div>
    </>
  );
};

export default Login;