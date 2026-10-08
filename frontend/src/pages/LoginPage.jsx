import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api, { apiError } from '../services/api';
import AuthLayout, { btnPrimary, Field, FormError, PasswordField } from '../components/AuthLayout';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const justRegistered = useLocation().state?.registered;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/usuarios/login', { email, senha });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(apiError(err, 'Não foi possível conectar ao servidor. Tente de novo em instantes.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Bem-vindo de volta, técnico" subtitle="Entre para continuar seus saves.">
      {justRegistered && (
        <p className="mb-6 rounded-lg border border-neon/30 bg-neon/10 px-3 py-2 text-sm text-neon">
          Conta criada. Agora é só entrar.
        </p>
      )}
      <form className="flex flex-col gap-5" onSubmit={handleLogin}>
        <Field
          label="E-mail"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tecnico@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordField
          label="Senha"
          id="senha"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <FormError>{error}</FormError>
        <button type="submit" disabled={loading} className={`${btnPrimary} mt-2`}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        Ainda não tem conta?{' '}
        <Link to="/register" className="font-semibold text-neon hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
