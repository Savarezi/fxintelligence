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

      {/* Seção Market Intelligence: Notícias + Texto de Conexão */}
      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4">
          
          <h2 className="mb-12 text-center text-3xl font-bold">
            Market <span className="text-gradient-green">Intelligence</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* 1. NOTÍCIAS (Destaque principal) */}
            <div className="lg:w-[65%] relative z-10">
              <NewsSection />
            </div>

            {/* 2. TEXTO PARA PREENCHER O ESPAÇO VAZIO */}
            <div className="lg:w-[35%] space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Zap className="h-3 w-3" /> Atualização em Tempo Real
              </div>
              
              <h3 className="text-2xl font-bold text-white leading-tight">
                Notícias que movem o mercado B2B
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                Nossas notícias são atualizadas instantaneamente. Todos os <strong>insights e análises detalhadas</strong> de cada matéria estão disponíveis de forma integrada em seu <strong>Dashboard</strong>.
              </p>

              <p className="text-sm text-gray-500 italic border-l-2 border-primary/30 pl-4">
                "Transforme informação bruta em decisão estratégica com o apoio da nossa IA."
              </p>

              <button
                onClick={handleCTA}
                className="group flex items-center gap-2 text-primary font-bold hover:text-white transition-colors"
              >
                Explorar insights no Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}