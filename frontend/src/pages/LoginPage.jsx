import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/usuarios/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      // Se quiser salvar dados do usuário: localStorage.setItem('user', JSON.stringify(response.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fundo Geral: Mudamos para o código hexadecimal direto #f6f8f6
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden font-display bg-[#f6f8f6] text-gray-800">
      <div className="flex min-h-screen w-full">
        
        {/* --- LADO ESQUERDO (Visual/Banner) --- */}
        {/* Gradiente: Usamos cores hexadecimais diretas para garantir o visual escuro/verde */}
        <div className="hidden md:flex flex-1 justify-center items-center p-8 bg-gradient-to-br from-[#11d411]/20 to-[#102210] relative overflow-hidden">
          
          {/* Padrão de Fundo (SVG) */}
          <div className="absolute inset-0 z-0 opacity-20">
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 L 0 10" stroke="#0e5a1e" strokeWidth="0.5"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"></rect>
              {/* Bolas verdes decorativas */}
              <circle cx="20" cy="80" r="15" fill="#11d411" opacity="0.4"></circle>
              <circle cx="80" cy="20" r="10" fill="#11d411" opacity="0.3"></circle>
              <path d="M 10 50 C 30 30, 70 30, 90 50 S 70 70, 30 70, 10 50" stroke="#11d411" strokeWidth="2" opacity="0.6"></path>
            </svg>
          </div>
          
          {/* Texto de destaque */}
          <div className="z-10 text-white text-center">
            <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">FIFA Manager</h2>
            <p className="text-xl text-[#11d411] drop-shadow-md">Estratégia e Paixão em Campo</p>
          </div>
        </div>

        {/* --- LADO DIREITO (Formulário) --- */}
        <div className="flex flex-1 justify-center items-center p-4 sm:p-8 md:p-12 lg:w-2/5 xl:w-1/3 min-w-[320px]">
          <div className="flex flex-col w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
            
            <h1 className="text-gray-900 tracking-tight text-3xl font-bold leading-tight text-center pb-6">
              Bem-vindo, Técnico
            </h1>

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              
              {/* Input Email */}
              <div className="flex flex-col">
                <label className="text-gray-700 text-base font-medium leading-normal pb-2" htmlFor="email">
                  Email
                </label>
                <input 
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#11d411]/50 border border-gray-300 bg-gray-50 focus:border-[#11d411] h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal transition-colors duration-200"
                  id="email"
                  type="email"
                  placeholder="ex: tecnico@fifa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Input Senha */}
              <div className="flex flex-col">
                <label className="text-gray-700 text-base font-medium leading-normal pb-2" htmlFor="password">
                  Senha
                </label>
                <div className="relative flex w-full flex-1 items-stretch">
                  <input 
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#11d411]/50 border border-gray-300 bg-gray-50 focus:border-[#11d411] h-14 placeholder:text-gray-400 p-[15px] pr-12 text-base font-normal leading-normal transition-colors duration-200"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#11d411] transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="pt-1">
                  <p className="text-red-600 text-sm font-normal leading-normal text-center bg-red-50 p-2 rounded">
                    {error}
                  </p>
                </div>
              )}

              {/* Botão de Entrar - Cor Fixa Verde Neon */}
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#11d411] hover:bg-[#11d411]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#11d411] text-[#111811] text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200 disabled:opacity-50"
                >
                  <span className="truncate">{loading ? 'Entrando...' : 'Entrar'}</span>
                </button>
              </div>
            </form>

            {/* Botão de Cadastro (Link) - Cor da borda e texto Fixa */}
            <div className="pt-4">
              <Link 
                to="/register"
                className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 border border-[#11d411] text-[#11d411] hover:bg-[#11d411]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#11d411] text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-200"
              >
                <span className="truncate">Criar nova conta</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;