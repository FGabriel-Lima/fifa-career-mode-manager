import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CareerCard from '../components/CareerCard';
import NewCareerModal from '../components/NewCareerModal';

function DashboardPage() {
  const [carreiras, setCarreiras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!hasToken) return;
    api
      .get('/carreiras')
      .then((response) => setCarreiras(response.data))
      .catch((error) => {
        if (error.response?.status === 401) navigate('/');
      })
      .finally(() => setLoading(false));
  }, [hasToken, navigate]);

  // Sem login, volta para a tela de entrada.
  if (!hasToken) return <Navigate to="/" replace />;

  const abrirCarreira = (id) => {
    // A tela de detalhes da carreira ainda não existe.
    console.log('Abrindo carreira:', id);
  };

  const onCareerCreated = (novaCarreira) => {
    setCarreiras([novaCarreira, ...carreiras]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-pitch-950 font-display text-chalk">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-neon">Seus saves</p>
            <h1 className="mt-1 font-kit text-5xl font-bold uppercase tracking-tight sm:text-6xl">Suas carreiras</h1>
          </div>
          {!loading && (
            <p className="text-muted">
              {carreiras.length === 0
                ? 'Nenhuma carreira ainda.'
                : `${carreiras.length} ${carreiras.length === 1 ? 'carreira' : 'carreiras'} em andamento`}
            </p>
          )}
        </div>

        {loading ? (
          <p className="mt-10 text-muted">Carregando seus saves…</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-pitch-700 text-center transition hover:border-neon hover:bg-neon/5"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-neon/10 text-neon">
                <span className="material-symbols-outlined text-3xl">add</span>
              </span>
              <span className="text-lg font-bold">Nova carreira</span>
              <span className="text-sm text-muted">Escolha o clube e comece a temporada</span>
            </button>

            {carreiras.map((carreira) => (
              <CareerCard key={carreira.id} carreira={carreira} onOpen={abrirCarreira} />
            ))}
          </div>
        )}
      </main>

      <NewCareerModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={onCareerCreated} />
    </div>
  );
}

export default DashboardPage;
