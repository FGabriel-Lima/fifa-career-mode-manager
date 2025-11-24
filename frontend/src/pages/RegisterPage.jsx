import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estados de controle
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validação: Senhas conferem?
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    // 2. Validação: Tamanho da senha (opcional, mas bom ter)
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 3. Chamada à API
      await api.post('/usuarios/register', { 
        email, 
        senha 
      });
      
      // 4. Sucesso
      alert('Conta criada com sucesso! Faça login para continuar.');
      navigate('/'); // Redireciona para o Login

    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Tente outro email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f8f6] overflow-x-hidden font-display">
      <div className="flex h-full min-h-screen grow flex-col">
        <main className="flex min-h-screen flex-1">
          <div className="flex w-full flex-col lg:flex-row">
            
            {/* --- LADO ESQUERDO (Banner Visual) --- */}
            <div className="relative hidden w-full items-center justify-center bg-[#102210] lg:flex lg:w-1/2 overflow-hidden">
              {/* Gradiente Verde */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#11d411]/20 to-[#102210] opacity-50"></div>
              
              {/* Padrão de Fundo (Reutilizando o grid do login para consistência) */}
              <div className="absolute inset-0 z-0 opacity-30">
                <svg className="w-full h-full" fill="none" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 L 0 10" stroke="#11d411" strokeWidth="0.5"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"></rect>
                </svg>
              </div>

              <div className="relative z-10 w-full max-w-md p-8 text-center">
                <div className="flex flex-col gap-6">
                  <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] drop-shadow-lg">
                    Inicie sua Carreira
                  </h1>
                  <p className="text-[#11d411] text-xl font-normal leading-normal drop-shadow-md">
                    Da tática à glória. O seu legado começa aqui.
                  </p>
                </div>
              </div>
            </div>

            {/* --- LADO DIREITO (Formulário) --- */}
            <div className="flex w-full flex-1 items-center justify-center p-4 lg:w-1/2 lg:p-8 bg-[#f6f8f6]">
              <div className="flex w-full max-w-md flex-col gap-8 rounded-xl bg-white p-6 shadow-lg lg:p-10 border border-gray-100">
                
                {/* Cabeçalho Mobile */}
                <div className="flex flex-col gap-2 text-left lg:hidden">
                  <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">Inicie sua Carreira</h1>
                  <h2 className="text-gray-500 text-sm font-normal leading-normal">O seu legado começa aqui.</h2>
                </div>

                {/* Cabeçalho Desktop */}
                <div className="hidden lg:flex flex-wrap justify-between gap-3">
                  <p className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                    Criar Nova Conta
                  </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                  
                  {/* Campo Email */}
                  <label className="flex flex-col flex-1">
                    <p className="text-gray-900 text-base font-medium leading-normal pb-2">Email</p>
                    <input 
                      required
                      type="email"
                      placeholder="seu.melhor@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#11d411]/50 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal border border-gray-300 bg-gray-50 focus:border-[#11d411]" 
                    />
                  </label>

                  {/* Campo Senha */}
                  <label className="flex flex-col flex-1">
                    <p className="text-gray-900 text-base font-medium leading-normal pb-2">Senha</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <input 
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha forte"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-r-none border-r-0 pr-2 text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#11d411]/50 focus:z-10 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal border border-gray-300 bg-gray-50 focus:border-[#11d411]" 
                      />
                      <div 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 flex border border-gray-300 bg-gray-50 items-center justify-center px-[15px] rounded-r-lg border-l-0 cursor-pointer hover:text-[#11d411] transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Campo Confirmar Senha */}
                  <label className="flex flex-col flex-1">
                    <p className="text-gray-900 text-base font-medium leading-normal pb-2">Confirmar Senha</p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <input 
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg rounded-r-none border-r-0 pr-2 text-gray-900 focus:outline-0 focus:ring-2 focus:ring-[#11d411]/50 focus:z-10 h-14 placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal border border-gray-300 bg-gray-50 focus:border-[#11d411]" 
                      />
                      <div 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 flex border border-gray-300 bg-gray-50 items-center justify-center px-[15px] rounded-r-lg border-l-0 cursor-pointer hover:text-[#11d411] transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Mensagem de Erro */}
                  {error && (
                    <div className="pt-2">
                      <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded border border-red-200">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex flex-col items-center gap-4 pt-2">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#11d411] px-6 text-base font-bold text-[#102210] transition-colors hover:bg-[#11d411]/90 focus:outline-none focus:ring-2 focus:ring-[#11d411] focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? 'Criando Conta...' : 'Criar Conta'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-600">
                      Já tem uma conta?{' '}
                      <Link to="/" className="font-semibold text-[#11d411] hover:underline">
                        Faça Login
                      </Link>
                    </p>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegisterPage;