import CurrencyConverter from '@/components/CurrencyConverter';
import NewsSection from '@/components/NewsSection';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate(user ? '/dashboard' : '/auth');
  };

  return (
    <main className="min-h-screen bg-hero-gradient pt-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Inteligência Cambial <span className="text-gradient-green">em Tempo Real</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Converta moedas com dados atualizados, acompanhe tendências e tome decisões estratégicas para o seu negócio.
          </p>
        </div>

        <CurrencyConverter />

        <div className="mt-12 text-center">
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 glow-green-strong"
          >
            Acesse o Dashboard – Consulta Precisa
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Seção Lado a Lado: Notícias + Card de Insight */}
      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4">
          
          <h2 className="mb-12 text-center text-3xl font-bold">
            Market <span className="text-gradient-green">Intelligence</span>
          </h2>

          <div className="relative flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* GRÁFICO DE CONEXÃO DISCRETO (Apenas Desktop) */}
            <div className="hidden lg:block absolute left-[68%] top-1/2 -translate-y-1/2 z-0 w-16 h-24">
              <svg width="100%" height="100%" viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                <path d="M0 50C30 50 30 50 60 50" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="30" cy="50" r="3" fill="#22c55e">
                  <animate attributeName="cx" values="0;60" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="50" x2="60" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22c55e" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#22c55e" />
                    <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* 1. NOTÍCIAS (Ocupa a maior parte da largura) */}
            <div className="lg:w-[70%] relative z-10">
              <NewsSection />
            </div>

            {/* 2. CARD MODERNO LATERAL (Ocupa o espaço restante) */}
            <div className="lg:w-[30%] relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-center text-center">
              
              {/* Efeito Neon de fundo */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-[60px]" />
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-[60px]" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                  <Zap className="h-7 w-7 text-primary-foreground" />
                </div>

                <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-white">
                  Insights <br/> em Tempo Real
                </h3>

                <p className="mb-8 text-sm leading-relaxed text-gray-400">
                  No seu <span className="text-white font-bold">Dashboard</span>, transformamos notícias em <span className="text-primary font-bold">inteligência logística</span> estratégica para o seu negócio.
                </p>

                <button
                  onClick={handleCTA}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3 px-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-primary hover:text-white"
                >
                  Ver Painel
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}