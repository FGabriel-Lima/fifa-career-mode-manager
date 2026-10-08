import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import api, { apiError } from '../services/api';
import Navbar from '../components/Navbar';
import { FormError } from '../components/AuthLayout';
import { Icon } from '../components/career/ui';
import { SeasonSelector } from '../components/career/SeasonSelector';
import { ClubHeader } from '../components/career/ClubHeader';
import { TabNavigation } from '../components/career/TabNavigation';
import { OverviewTab } from '../components/career/OverviewTab';
import { SquadTab } from '../components/career/SquadTab';
import { TransfersTab } from '../components/career/TransfersTab';
import { TrophiesTab } from '../components/career/TrophiesTab';
import { HallOfFame } from '../components/career/HallOfFame';
import AddPlayerModal from '../components/career/AddPlayerModal';
import UpdateLeagueModal from '../components/career/UpdateLeagueModal';
import AddTransferModal from '../components/career/AddTransferModal';
import AddTitleModal from '../components/career/AddTitleModal';
import EditPlayerModal from '../components/career/EditPlayerModal';
import AddWorldTitleModal from '../components/career/AddWorldTitleModal';
import AddCandidateModal from '../components/career/AddCandidateModal';
import NewSeasonModal from '../components/career/NewSeasonModal';

export default function CareerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem('token'));

  const [carreira, setCarreira] = useState(null);
  const [temporadaAtiva, setTemporadaAtiva] = useState(null);
  const [rankingHistorico, setRankingHistorico] = useState([]);
  const [historicoTitulos, setHistoricoTitulos] = useState([]);
  const [premiosClube, setPremiosClube] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [modal, setModal] = useState(null); // qual modal está aberto
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);

  const fetchAlmanaque = useCallback(
    async (seasonId) => {
      const [titulos, premios] = await Promise.all([
        api.get(`/premios/titulos/historico/${id}`),
        api.get(`/premios/clube/${seasonId}`),
      ]);
      setHistoricoTitulos(titulos.data);
      setPremiosClube(premios.data);
    },
    [id]
  );

  // Recarrega tudo; mantém a temporada aberta (ou abre a indicada, ao criar uma nova).
  const refreshData = useCallback(
    async (seasonId) => {
      try {
        const [resCarreira, resRanking] = await Promise.all([
          api.get(`/carreiras/${id}`),
          api.get(`/carreiras/${id}/hall-of-fame?limit=100`),
        ]);
        const temporadas = resCarreira.data.temporadas || [];
        setCarreira(resCarreira.data);
        setRankingHistorico(resRanking.data);
        setTemporadaAtiva((atual) => temporadas.find((t) => t.id === (seasonId ?? atual?.id)) || temporadas[0] || null);
      } catch (err) {
        if (err.response?.status === 401) return navigate('/');
        setPageError(apiError(err, 'Não foi possível carregar a carreira.'));
      } finally {
        setLoading(false);
      }
    },
    [id, navigate]
  );

  useEffect(() => {
    if (hasToken) refreshData();
  }, [hasToken, refreshData]);

  useEffect(() => {
    if (temporadaAtiva?.id) fetchAlmanaque(temporadaAtiva.id).catch(() => {});
  }, [temporadaAtiva?.id, fetchAlmanaque]);

  if (!hasToken) return <Navigate to="/" replace />;

  const refreshAll = async () => {
    await refreshData();
    if (temporadaAtiva?.id) await fetchAlmanaque(temporadaAtiva.id);
  };

  const run = async (action, fallback) => {
    setPageError('');
    try {
      await action();
    } catch (err) {
      setPageError(apiError(err, fallback));
    }
  };

  const handleCalculateBallonDor = () =>
    run(async () => {
      await api.post(`/premios/calcular/${temporadaAtiva.premio_temporada.id}`);
      await refreshAll();
    }, 'Não foi possível calcular o vencedor.');

  const handleRemovePlayer = (squadId) => {
    if (!window.confirm('Remover este jogador do elenco desta temporada?')) return;
    run(async () => {
      await api.delete(`/jogadores/elenco/${squadId}`);
      await refreshData();
    }, 'Não foi possível remover o jogador.');
  };

  const handleDeletarCarreira = () => {
    if (!window.confirm('Apagar esta carreira? Todas as temporadas, jogadores, transferências e títulos somem de vez.')) return;
    run(async () => {
      await api.delete(`/carreiras/${id}`);
      navigate('/dashboard');
    }, 'Não foi possível apagar a carreira.');
  };

  const shell = (content) => (
    <div className="min-h-screen bg-pitch-950 font-display text-chalk">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{content}</main>
    </div>
  );

  if (loading) return shell(<p className="text-muted">Carregando a carreira…</p>);
  if (!carreira || !temporadaAtiva)
    return shell(
      <div className="space-y-4">
        <FormError>{pageError || 'Carreira não encontrada.'}</FormError>
        <button onClick={() => navigate('/dashboard')} className="font-semibold text-neon">
          Voltar para suas carreiras
        </button>
      </div>
    );

  const clube = temporadaAtiva.clube_nome;

  return shell(
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-neon"
        >
          <Icon name="arrow_back" className="text-lg" />
          Suas carreiras
        </button>
        <button
          onClick={handleDeletarCarreira}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:bg-red-500/10 hover:text-red-300"
        >
          <Icon name="delete" className="text-lg" />
          Apagar carreira
        </button>
      </div>

      <ClubHeader careerName={carreira.nome_carreira} data={temporadaAtiva} />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SeasonSelector seasons={carreira.temporadas} selectedSeason={temporadaAtiva} onSeasonChange={setTemporadaAtiva} />
        <button
          onClick={() => setModal('newSeason')}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-pitch-700 px-4 text-sm font-semibold text-chalk transition hover:border-neon hover:text-neon"
        >
          <Icon name="skip_next" className="text-lg" />
          Encerrar temporada
        </button>
      </div>

      {pageError && <div className="mt-6"><FormError>{pageError}</FormError></div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === 'overview' && <OverviewTab data={temporadaAtiva} onEditLeague={() => setModal('league')} />}
            {activeTab === 'squad' && (
              <SquadTab
                data={temporadaAtiva}
                onAddPlayer={() => setModal('player')}
                onEditPlayer={(player) => {
                  setSelectedPlayer(player);
                  setModal('editPlayer');
                }}
                onRemovePlayer={handleRemovePlayer}
              />
            )}
            {activeTab === 'transfers' && <TransfersTab data={temporadaAtiva} onAddTransfer={() => setModal('transfer')} />}
            {activeTab === 'trophies' && (
              <TrophiesTab
                data={{
                  nome: temporadaAtiva.nome,
                  clube_nome: clube,
                  trophies: historicoTitulos.filter((t) => t.temporada_id === temporadaAtiva.id),
                  individualAwards: premiosClube,
                  ballonDor: temporadaAtiva.ballonDor,
                }}
                onAddTitle={() => setModal('title')}
                onAddWorldTitle={() => setModal('worldTitle')}
                onAddCandidate={() => setModal('candidate')}
                onCalculateWinner={handleCalculateBallonDor}
              />
            )}
          </div>
        </div>

        <aside className="lg:pt-[3.25rem]">
          <HallOfFame ranking={rankingHistorico} />
        </aside>
      </div>

      <UpdateLeagueModal isOpen={modal === 'league'} onClose={closeModal} seasonId={temporadaAtiva.id} seasonData={temporadaAtiva} onSuccess={refreshData} />
      <AddPlayerModal isOpen={modal === 'player'} onClose={closeModal} careerId={id} seasonId={temporadaAtiva.id} onSuccess={refreshData} />
      <EditPlayerModal isOpen={modal === 'editPlayer'} onClose={closeModal} player={selectedPlayer} onSuccess={refreshData} />
      <AddTransferModal isOpen={modal === 'transfer'} onClose={closeModal} seasonId={temporadaAtiva.id} clubName={clube} onSuccess={refreshData} />
      <AddTitleModal isOpen={modal === 'title'} onClose={closeModal} seasonId={temporadaAtiva.id} currentClubName={clube} onSuccess={refreshAll} />
      <AddWorldTitleModal isOpen={modal === 'worldTitle'} onClose={closeModal} seasonId={temporadaAtiva.id} onSuccess={refreshAll} />
      <AddCandidateModal
        isOpen={modal === 'candidate'}
        onClose={closeModal}
        seasonId={temporadaAtiva.id}
        premioId={temporadaAtiva.premio_temporada?.id}
        onSuccess={refreshAll}
      />
      <NewSeasonModal isOpen={modal === 'newSeason'} onClose={closeModal} careerId={id} currentSeason={temporadaAtiva} onSuccess={refreshData} />
    </>
  );
}
