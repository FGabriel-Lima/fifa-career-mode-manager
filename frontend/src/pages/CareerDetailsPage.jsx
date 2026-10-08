import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

// Importe os componentes que você moveu para a pasta de componentes
import { SeasonSelector } from '../components/career/SeasonSelector'
import { ClubHeader } from '../components/career/ClubHeader'
import { TabNavigation } from '../components/career/TabNavigation'
import { OverviewTab } from '../components/career/OverviewTab'
import { SquadTab } from '../components/career/SquadTab'
import { TransfersTab } from '../components/career/TransfersTab'
import { TrophiesTab } from '../components/career/TrophiesTab'
import { HallOfFame } from '../components/career/HallOfFame'
import AddPlayerModal from '../components/career/AddPlayerModal'
import UpdateLeagueModal from '../components/career/UpdateLeagueModal'
import AddTransferModal from '../components/career/AddTransferModal'
import { Trash2 } from 'lucide-react'
import AddTitleModal from '../components/career/AddTitleModal'
import EditPlayerModal from '../components/career/EditPlayerModal'
import AddWorldTitleModal from '../components/career/AddWorldTitleModal'
import AddCandidateModal from '../components/career/AddCandidateModal'
import NewSeasonModal from '../components/career/NewSeasonModal'

export default function CareerDetailsPage() {
  const { id } = useParams() // ID da carreira vindo da URL
  const navigate = useNavigate()

  // Estados para controlar os dados do banco
  const [carreira, setCarreira] = useState(null)
  const [temporadaAtiva, setTemporadaAtiva] = useState(null)
  const [rankingHistorico, setRankingHistorico] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false)
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [historicoTitulos, setHistoricoTitulos] = useState([])
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false)
  const [premiosClube, setPremiosClube] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isWorldTitleModalOpen, setIsWorldTitleModalOpen] = useState(false)
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false)
  const [isNewSeasonModalOpen, setIsNewSeasonModalOpen] = useState(false)
  //const [selecedSeasonId, setSelecetedSeasonId] = useState(null)


 const handleCalculateBallonDor = async () => {
  // CORREÇÃO AQUI: Remova o ?.[0] e use o nome no singular se estiver disponível
  // Tenta pegar do singular (novo padrão) ou do plural (antigo) por segurança
  const premioId = temporadaAtiva?.premio_temporada?.id || 
                   temporadaAtiva?.premios_temporada?.[0]?.id;
  
  console.log("Tentando calcular prêmio. ID encontrado:", premioId); // Debug

  if (!premioId) {
    alert("Nenhum prêmio inicializado ou candidatos cadastrados.");
    return;
  }

  try {
    const response = await api.post(`/premios/calcular/${premioId}`);
    
    // Atualiza a tela
    fetchAlmanaque(); 
    alert(`Vencedor Definido: ${response.data.vencedor.nome_jogador}!`);
    await refreshData();
  } catch (error) {
    console.error("Erro ao calcular:", error);
    alert("Erro ao calcular vencedor. Tente novamente.");
  }
};

  const refreshData = async (forceSeasonId = null) => {
    try {
      const resCarreira = await api.get(`/carreiras/${id}`)
      setCarreira(resCarreira.data)

      // LÓGICA DE SELEÇÃO INTELIGENTE
      let novaTemporadaAtiva = null;

      if (forceSeasonId) {
         // Se mandamos forçar um ID (caso de criar nova temporada), busca ele
         novaTemporadaAtiva = resCarreira.data.temporadas.find(t => t.id === forceSeasonId);
      } else {
         // Se não, tenta manter a que já estava selecionada
         novaTemporadaAtiva = resCarreira.data.temporadas.find(t => t.id === temporadaAtiva?.id);
      }
      
      // Se achou a temporada (nova ou velha), atualiza o estado
      if (novaTemporadaAtiva) {
          setTemporadaAtiva(novaTemporadaAtiva);
      }

      // Recarrega o Hall da Fama e o Almanaque
      const resRanking = await api.get(`/carreiras/${id}/hall-of-fame`)
      setRankingHistorico(resRanking.data)
      fetchAlmanaque()
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
    }
  }

  const fetchAlmanaque = async () => {
    try {
      // 1. Títulos da Carreira (Já temos)
      const resTitulos = await api.get(`/premios/titulos/historico/${id}`)
      setHistoricoTitulos(resTitulos.data)

      // 2. Prêmios do Clube (Nova busca baseada na temporada ativa)
      if (temporadaAtiva?.id) {
        const resPremios = await api.get(`/premios/clube/${temporadaAtiva.id}`)
        setPremiosClube(resPremios.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (id && temporadaAtiva?.id) fetchAlmanaque()
  }, [id, temporadaAtiva?.id])

  const handleDeletarCarreira = async () => {
    // Confirmação simples do navegador para evitar acidentes
    const confirmou = window.confirm(
      'TEM CERTEZA? Isso apagará permanentemente todas as temporadas, jogadores, transferências e títulos desta carreira. Esta ação não pode ser desfeita.'
    )

    if (confirmou) {
      try {
        await api.delete(`/carreiras/${id}`)
        alert('Carreira apagada com sucesso!')
        navigate('/dashboard') // Volta para a lista de carreiras
      } catch (err) {
        console.error('Erro ao apagar', err)
        alert('Erro ao apagar carreira.')
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Busca os detalhes da carreira (carregando as temporadas juntas)
        const resCarreira = await api.get(`/carreiras/${id}`)
        setCarreira(resCarreira.data)

        // Define a temporada mais recente como a inicial
        if (
          resCarreira.data.temporadas &&
          resCarreira.data.temporadas.length > 0
        ) {
          setTemporadaAtiva(resCarreira.data.temporadas[0])
        }

        // 2. Busca os dados do Hall da Fama (Lendas do Clube)
        const resRanking = await api.get(`/carreiras/${id}/hall-of-fame?limit=100`)
        setRankingHistorico(resRanking.data)
      } catch (error) {
        console.error('Erro ao carregar detalhes da carreira:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading)
    return <div className="text-white p-10">Carregando gerenciador...</div>
  if (!carreira)
    return <div className="text-white p-10">Carreira não encontrada.</div>

  return (
    <div className="min-h-screen bg-[#102210] text-white">
      {/* Seletor de Temporadas (Usa as temporadas do banco) */}
      <SeasonSelector
        seasons={carreira.temporadas}
        selectedSeason={temporadaAtiva}
        onSeasonChange={season => setTemporadaAtiva(season)}
      />

      <button 
        onClick={() => setIsNewSeasonModalOpen(true)}
        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-bold uppercase transition-all flex items-center gap-2"
    >
        Encerrar Temporada
    </button>

      <div className="flex gap-6 p-6">
        {/* Conteúdo Principal */}
        <div className="flex-1">
          {/* Cabeçalho do Clube (Passa os dados da temporada selecionada) */}
          <ClubHeader data={temporadaAtiva} />

          {/* Navegação de Abas */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Conteúdo da Aba Ativa */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <OverviewTab
                data={temporadaAtiva}
                onEditLeague={() => setIsLeagueModalOpen(true)}
              />
            )}
            {activeTab === 'squad' && (
              <SquadTab
                data={temporadaAtiva}
                onAddPlayer={() => setIsPlayerModalOpen(true)}
                onEditPlayer={player => {
                  setSelectedPlayer(player)
                  setIsEditModalOpen(true)
                }}
                onRemovePlayer={async squadId => {
                  if (
                    window.confirm(
                      'Remover este jogador do elenco da temporada?'
                    )
                  ) {
                    try {
                      await api.delete(`/jogadores/elenco/${squadId}`)
                      refreshData() // Recarrega a lista sem F5
                    } catch (err) {
                      alert('Erro ao remover jogador.')
                    }
                  }
                }}
              />
            )}
            {activeTab === 'transfers' && (
              <TransfersTab
                data={temporadaAtiva}
                onAddTransfer={() => setIsTransferModalOpen(true)}
              />
            )}
           {activeTab === 'trophies' && (
  <TrophiesTab
    key={temporadaAtiva?.id} // Isso força o reset visual
    data={{
      // 1. CORREÇÃO: Passar ID e Nome para os logs funcionarem e o componente se localizar
      id: temporadaAtiva?.id,
      nome: temporadaAtiva?.nome,

      // 2. CORREÇÃO CRÍTICA: Filtrar apenas os títulos desta temporada!
      // Antes você passava 'historicoTitulos' (tudo). Agora só passa o que pertence a este ID.
      trophies: historicoTitulos.filter(t => t.temporada_id === temporadaAtiva?.id),
      
      individualAwards: premiosClube,
      
      // 3. CORREÇÃO: Usar o nome correto que o componente espera
      clube_nome: temporadaAtiva?.clube_nome, 
      
      ballonDor: temporadaAtiva?.ballonDor
    }}
    onAddTitle={() => setIsTitleModalOpen(true)}
    onAddWorldTitle={() => setIsWorldTitleModalOpen(true)}
    onAddCandidate={() => setIsCandidateModalOpen(true)}
    onCalculateWinner={handleCalculateBallonDor}
  />
)}
          </div>
        </div>

        {/* Hall of Fame - Sidebar Fixa com dados REAIS do banco */}
        <HallOfFame ranking={rankingHistorico} />
        <button
          onClick={handleDeletarCarreira}
          className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-lg transition-all duration-300 group"
          title="Apagar Carreira"
        >
          <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <AddCandidateModal
      isOpen={isCandidateModalOpen}
      onClose={() => setIsCandidateModalOpen(false)}
      seasonId={temporadaAtiva?.id}
      premioId={temporadaAtiva?.premio_temporada?.[0]?.id} // Passa o ID se já existir
      onSuccess={() => {
        fetchAlmanaque(); // Recarrega a tela para atualizar dados
        // Aqui você também pode chamar uma função para recalcular o vencedor se quiser
      }}
    />

    <NewSeasonModal 
        isOpen={isNewSeasonModalOpen}
        onClose={() => setIsNewSeasonModalOpen(false)}
        careerId={id}
        currentSeason={temporadaAtiva}
        onSuccess={async (novaTemporadaId) => {
            // Chama o refresh passando o ID novo. 
            // A função refreshData vai cuidar de selecionar a aba certa.
            await refreshData(novaTemporadaId);
        }}
      />

      <AddWorldTitleModal
        isOpen={isWorldTitleModalOpen}
        onClose={() => setIsWorldTitleModalOpen(false)}
        seasonId={temporadaAtiva?.id}
        onSuccess={fetchAlmanaque} // Recarrega os títulos na tela
      />

      {/* NOVO MODAL DE EDIÇÃO */}
      <EditPlayerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPlayer(null)
        }}
        player={selectedPlayer}
        onSuccess={refreshData}
      />

      <AddTitleModal
        isOpen={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        seasonId={temporadaAtiva?.id}
        currentClubName={temporadaAtiva?.clube_nome}
        onSuccess={fetchAlmanaque} // Função que criamos para recarregar os títulos
      />

      <AddTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        seasonId={temporadaAtiva?.id}
        onSuccess={() => window.location.reload()}
      />

      <UpdateLeagueModal
        isOpen={isLeagueModalOpen}
        onClose={() => setIsLeagueModalOpen(false)}
        seasonId={temporadaAtiva?.id}
        seasonData={temporadaAtiva}
        onSuccess={() => window.location.reload()} // Recarrega para ver os novos números
      />

      <AddPlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        careerId={id}
        seasonId={temporadaAtiva?.id}
        onSuccess={() => {
          // Aqui você pode recarregar os dados para o novo jogador aparecer na lista
          window.location.reload()
        }}
      />
    </div>
  )
}
