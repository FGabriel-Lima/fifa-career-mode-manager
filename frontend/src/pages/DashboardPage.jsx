import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CareerCard from '../components/CareerCard';
import NewCareerModal from '../components/NewCareerModal'; 
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [carreiras, setCarreiras] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarreiras = async () => {
      try {
        const response = await api.get('/carreiras');
        setCarreiras(response.data);
      } catch (error) {
        console.error("Erro ao buscar carreiras", error);
        if (error.response?.status === 401) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchCarreiras();
  }, [navigate]);

  const abrirCarreira = (id) => {
    console.log("Abrindo carreira:", id);
    // navigate(`/career/${id}`); 
  };

  const onCareerCreated = (novaCarreira) => {
    setCarreiras([novaCarreira, ...carreiras]); 
    setShowModal(false);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#102210] group/design-root overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        
        <Navbar />

        <main className="flex-1 px-4 sm:px-8 md:px-20 lg:px-40 py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
            
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                Suas Carreiras
              </p>
            </div>

            {loading && <p className="text-white p-4">Carregando seus saves...</p>}

            {!loading && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 p-4">
                
                <div 
                  onClick={() => setShowModal(true)}
                  className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-[#11d411]/50 p-3 text-center transition-all hover:border-[#11d411] hover:bg-[#11d411]/10 cursor-pointer min-h-[280px]"
                >
                  <span className="material-symbols-outlined text-[#11d411]" style={{fontSize: '48px'}}>add_circle</span>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-white text-lg font-bold leading-tight">Nova Carreira</p>
                    <p className="text-white/70 text-sm font-normal">Comece uma nova jornada</p>
                  </div>
                </div>

                {/* Lista de Carreiras */}
                {carreiras.map((carreira) => (
                  <CareerCard 
                    key={carreira.id} 
                    carreira={carreira} 
                    onOpen={abrirCarreira} 
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <NewCareerModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSuccess={onCareerCreated} 
        />

      </div>
    </div>
  );
}

export default DashboardPage;