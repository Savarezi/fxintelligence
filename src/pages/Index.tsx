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
      {/* Hero + Converter */}
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

        {/* CTA */}
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

      {/* Features */}
      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-3">
          {[
            { icon: TrendingUp, title: 'Dados em Tempo Real', desc: 'Cotações atualizadas diretamente de fontes confiáveis.' },
            { icon: Shield, title: 'Análises Exclusivas', desc: 'Insights premium para decisões estratégicas B2B.' },
            { icon: Zap, title: 'Automação Inteligente', desc: 'Integrações automáticas para manter tudo atualizado.' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30"
            >
              <feature.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Últimas <span className="text-gradient-green">Notícias</span>
          </h2>
          <NewsSection />
        </div>
      </section>
    </main>
  );
}
