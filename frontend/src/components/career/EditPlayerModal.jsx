import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { X } from 'lucide-react'

export default function EditPlayerModal({
  isOpen,
  onClose,
  player,
  onSuccess
}) {
  // Estado inicial limpo
  const [formData, setFormData] = useState({
    overall: 0,
    idade: 0,
    gols: 0,
    assistencias: 0,
    valor_mercado: 0,
    jogos_disputados: 0
  })

  // Sempre que o "player" mudar ou o modal abrir, mapeamos os nomes das colunas
  useEffect(() => {
    if (player) {
      setFormData({
        // Mapeia o que vem da tabela (ovr, age, etc) para o que o formulário usa
        overall: player.ovr || player.overall || 0,
        idade: player.age || player.idade || 0,
        gols: player.goals || player.gols || 0,
        assistencias: player.assists || player.assistencias || 0,
        valor_mercado: Number(player.valor_mercado) || 0,
        jogos_disputados: player.jogos_disputados || 0
      })
    }
  }, [player, isOpen])

  const handleSubmit = async e => {
    e.preventDefault()

    // Convertemos tudo para número para o Prisma não reclamar
    const payload = {
      overall: Number(formData.overall),
      idade: Number(formData.idade),
      gols: Number(formData.gols),
      assistencias: Number(formData.assistencias),
      valor_mercado: Number(formData.valor_mercado),
      jogos_disputados: Number(formData.jogos_disputados)
    }

    try {
      await api.put(`/jogadores/elenco/${player.id}`, payload)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Erro ao salvar:', err.response?.data || err.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0d1a0d] border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase text-white italic tracking-tighter">
            Editar Estatísticas
          </h2>
          <button onClick={onClose} className="text-white/20 hover:text-white">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="col-span-2 bg-[#11d411]/10 p-4 rounded-xl border border-[#11d411]/20">
            <p className="text-[10px] uppercase font-black text-[#11d411] tracking-widest mb-1">
              Atleta
            </p>
            <p className="text-white font-bold text-lg">
              {player.name || player.jogador?.nome_completo}
            </p>
          </div>

          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Overall (OVR)
            </label>
            <input
              type="number"
              value={formData.overall}
              onChange={e =>
                setFormData({ ...formData, overall: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#11d411] outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Idade
            </label>
            <input
              type="number"
              value={formData.idade}
              onChange={e =>
                setFormData({ ...formData, idade: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#11d411] outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Partidas Disputadas
            </label>
            <input
              type="number"
              value={formData.jogos_disputados}
              onChange={e =>
                setFormData({ ...formData, jogos_disputados: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#11d411] outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Gols na Temporada
            </label>
            <input
              type="number"
              value={formData.gols}
              onChange={e => setFormData({ ...formData, gols: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#11d411] outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Assistências
            </label>
            <input
              type="number"
              value={formData.assistencias}
              onChange={e =>
                setFormData({ ...formData, assistencias: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#11d411] outline-none transition-all"
            />
          </div>

          <div className="col-span-2 flex gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-white/40 font-bold uppercase text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] bg-[#11d411] text-[#102210] py-4 rounded-xl font-black uppercase text-sm hover:scale-105 transition-all"
            >
              Confirmar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
