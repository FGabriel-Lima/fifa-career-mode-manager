import React, { useState } from 'react'
import api from '../../services/api'
import { Globe, X } from 'lucide-react'

export default function AddWorldTitleModal({
  isOpen,
  onClose,
  seasonId,
  onSuccess
}) {
  const [nomeTitulo, setNomeTitulo] = useState('')
  const [clubeVencedor, setClubeVencedor] = useState('')
  const [clubeVice, setClubeVice] = useState('')

  const handleSubmit = async e => {
  e.preventDefault()
  try {
    await api.post(`/premios/mundo/${seasonId}`, {
      campeoes: [{ 
        nome_titulo: nomeTitulo, 
        clube_vencedor: clubeVencedor,
        clube_vice: clubeVice // <-- ADICIONE ESTA LINHA AQUI!
      }]
    })
    
    // Limpa os campos após salvar
    setNomeTitulo('')
    setClubeVencedor('')
    setClubeVice('') // Limpe o vice também
    
    onSuccess()
    onClose()
  } catch (err) {
    console.error('Erro ao salvar campeão mundial:', err)
  }
}

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-[#0d1a0d] border border-blue-500/30 p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-black uppercase text-white italic flex items-center gap-2">
            <Globe className="text-blue-400 w-5 h-5" /> Registrar Campeão
          </h2>
          <button onClick={onClose} className="text-white/20 hover:text-white">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Competição
            </label>
            <input
              placeholder="Ex: Champions League"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={nomeTitulo}
              onChange={e => setNomeTitulo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Clube Campeão
            </label>
            <input
              placeholder="Ex: Real Madrid"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={clubeVencedor}
              onChange={e => setClubeVencedor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-white/40 font-black mb-2 block">
              Vice-Campeão
            </label>
            <input
              placeholder="Ex: Manchester City"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
              value={clubeVice}
              onChange={e => setClubeVice(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-sm hover:bg-blue-500 transition-all"
          >
            Salvar no Almanaque
          </button>
        </form>
      </div>
    </div>
  )
}
