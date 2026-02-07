import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Componentes customizados que vamos adaptar
import DashboardCurrencyCards from '@/components/DashboardCurrencyCards';
import ProductCards from '@/components/ProductCards';
import ImportSemaphore from '@/components/ImportSemaphore';
import TimelineChart from '@/components/TimelineChart';
import ExpertInsights from '@/components/ExpertInsights';

import { 
  BarChart3, 
  Lightbulb, 
  Package, 
  Activity, 
  LineChart, 
  BrainCircuit, 
  Zap,
  Info
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#22c55e] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#020817] text-white pt-16">
      <div className="container mx-auto px-4 py-8">
        
        {/* HEADER PROFISSIONAL */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-[#22c55e]" />
              Painel de Inteligência Comercial
            </h1>
            <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
              </span>
              Monitoramento Global em Tempo Real • Conectado ao Supabase
            </p>
          </div>
        </div>

        {/* 1. SEÇÃO CÂMBIO (Apenas Dólar e Euro - Tabela: historico_cambio) */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500">
            <Activity className="h-4 w-4 text-[#22c55e]" />
            Mercado de Câmbio Internacional
          </h2>
          {/* Note: Aqui o componente DashboardCurrencyCards deve ser filtrado para não exibir 'Real' */}
          <DashboardCurrencyCards /> 
        </section>

        {/* 2. GRÁFICO MODERNO (Dólar vs Euro - Tabela: historico_cambio) */}
        <section className="mb-12 rounded-2xl border border-white/10 bg-[#0c0c0e] p-6 shadow-2xl">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold uppercase">
                <LineChart className="h-5 w-5 text-[#22c55e]" />
                Análise Comparativa de Volatilidade
              </h2>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 italic">
                <Info size={14} className="text-[#22c55e]" />
                <p>Este gráfico processa dados da tabela <b>historico_cambio</b>, comparando a paridade de venda do USD e EUR para identificar tendências de arbitragem e força de moeda.</p>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
             {/* O TimelineChart deve ser configurado com Tooltip customizado (cores vibrantes) */}
             <TimelineChart />
          </div>
        </section>

        {/* 3. COMMODITIES E ENERGIA (Tabela: produtos_globais - Soja, Petróleo, Diesel) */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500">
            <Package className="h-4 w-4 text-[#22c55e]" />
            AGRO-TECH & ENERGY INDEX
          </h2>
          {/* Componente ProductCards configurado para Soja, Petróleo e Diesel */}
          <ProductCards /> 
        </section>

        {/* 4. SEMÁFORO DE IMPORTAÇÃO (Baseado em Níveis Críticos do Banco) */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500">
            <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
            Semáforo Analítico de Importação
          </h2>
          <div className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-8">
            <ImportSemaphore />
          </div>
        </section>

        {/* 5. CEREJA DO BOLO: INSIGHTS IA (Moderno, Alertas Piscando, Cérebro Elegante) */}
        <section className="relative overflow-hidden rounded-3xl border border-[#22c55e]/30 bg-gradient-to-br from-[#0c0c0e] to-[#020817] p-8 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit size={150} className="text-[#22c55e]" />
          </div>
          
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e]/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <BrainCircuit className="h-7 w-7 text-[#22c55e]" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter">AI Expert Insights</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
                  <span className="text-[10px] font-bold text-red-500 uppercase">Dados em tempo real analisados</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              {/* Conteúdo vindo da IA */}
              <ExpertInsights />
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}