import { Database, Globe, BarChart3, Server, Cpu, Shield } from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <section className="border-b border-border bg-hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            Quem <span className="text-gradient-green">Somos</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Uma plataforma de inteligência de dados B2B, construída para transformar informações financeiras em decisões estratégicas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left - Text */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold">
                Inteligência de Dados para <span className="text-gradient-green">Negócios Globais</span>
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                A FX Intelligence foi criada para atender a demanda crescente de informações precisas e atualizadas 
                sobre o mercado cambial e commodities globais. Nossa missão é democratizar o acesso a dados 
                financeiros de alta qualidade para empresas de todos os portes.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Nossa Abordagem</h3>
              <p className="leading-relaxed text-muted-foreground">
                Combinamos automação avançada, integrações em tempo real e análises especializadas para 
                entregar uma experiência única. Nossos dados são coletados e processados automaticamente, 
                garantindo precisão e atualidade constante.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Tecnologia de Ponta</h3>
              <p className="leading-relaxed text-muted-foreground">
                Nossa infraestrutura é baseada em tecnologias modernas e escaláveis. Utilizamos pipelines 
                automatizados para coleta de dados, análise em tempo real e distribuição de insights 
                exclusivos para nossos clientes.
              </p>
            </div>
          </div>

          {/* Right - Feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe, title: 'Cobertura Global', desc: 'Múltiplas moedas e mercados internacionais' },
              { icon: Database, title: 'Dados em Tempo Real', desc: 'Atualização contínua via integrações' },
              { icon: BarChart3, title: 'Análises Avançadas', desc: 'Gráficos e insights estratégicos' },
              { icon: Server, title: 'Infraestrutura Robusta', desc: 'Alta disponibilidade e performance' },
              { icon: Cpu, title: 'Automação Total', desc: 'Pipelines inteligentes de dados' },
              { icon: Shield, title: 'Segurança', desc: 'Dados protegidos e acesso controlado' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:glow-green"
              >
                <item.icon className="mb-3 h-8 w-8 text-primary" />
                <h4 className="mb-1 text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-mono text-primary">n8n</span> & <span className="font-mono text-primary">Supabase Realtime</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
