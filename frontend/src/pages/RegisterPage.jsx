import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { apiError } from '../services/api';
import AuthLayout, { btnPrimary, Field, FormError, PasswordField } from '../components/AuthLayout';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (senha.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não são iguais. Digite a mesma senha nos dois campos.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/usuarios/register', { email, senha });
      navigate('/', { state: { registered: true } });
    } catch (err) {
      setError(apiError(err, 'Não foi possível criar a conta. Tente de novo em instantes.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Comece sua carreira" subtitle="Crie sua conta para guardar seus saves.">
      <form className="flex flex-col gap-5" onSubmit={handleRegister}>
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
          autoComplete="new-password"
          placeholder="Pelo menos 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <PasswordField
          label="Confirmar senha"
          id="confirmar"
          autoComplete="new-password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />
        <FormError>{error}</FormError>
        <button type="submit" disabled={loading} className={`${btnPrimary} mt-2`}>
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link to="/" className="font-semibold text-neon hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
