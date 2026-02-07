import { Database, Globe, BarChart3, Server, Cpu, Shield } from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-background pt-16">
      {/* Hero - BANNER COM IMAGEM FIXA NO CÓDIGO */}
      <section className="relative border-b border-border py-28 overflow-hidden bg-zinc-950">
        <img 
          src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600" 
          alt="Banner Background" 
          className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-zinc-950" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl text-white tracking-tight">
            Quem <span className="text-gradient-green">Somos</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Uma plataforma de inteligência de dados B2B, construída para transformar informações financeiras em decisões estratégicas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left - Text */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold leading-tight">
                Inteligência de Dados para <br />
                <span className="text-gradient-green text-4xl">Negócios Globais</span>
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                A FX Intelligence foi criada para atender a demanda crescente de informações precisas e atualizadas sobre o mercado cambial e commodities globais.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="border-l-2 border-primary pl-4">
                <h3 className="mb-2 text-xl font-semibold text-white">Nossa Abordagem</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Combinamos automação avançada e integrações em tempo real para entregar precisão absoluta.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h3 className="mb-2 text-xl font-semibold text-white">Tecnologia de Ponta</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Infraestrutura escalável com pipelines automatizados de análise exclusiva.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Feature grid - 6 IMAGENS NOVAS E DIFERENTES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { 
                icon: Globe, 
                title: 'Cobertura Global', 
                desc: 'Múltiplas moedas e mercados internacionais', 
                image: 'https://images.pexels.com/photos/4194850/pexels-photo-4194850.jpeg?auto=compress&cs=tinysrgb&w=600' 
              },
              { 
                icon: Database, 
                title: 'Dados em Tempo Real', 
                desc: 'Atualização contínua via APIs diretas', 
                image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600' 
              },
              { 
                icon: BarChart3, 
                title: 'Análise com IA', 
                desc: 'Insights processados por inteligência artificial', 
                image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600' 
              },
              { 
                icon: Server, 
                title: 'Infraestrutura Robusta', 
                desc: 'Alta performance para dados críticos', 
                image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600' 
              },
              { 
                icon: Cpu, 
                title: 'Automação Total', 
                desc: 'Pipelines inteligentes de dados', 
                image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600' 
              },
              { 
                icon: Shield, 
                title: 'Segurança de Dados', 
                desc: 'Criptografia e controle rigoroso', 
                image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600' 
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative h-64 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 transition-all duration-500 hover:border-primary/50"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-md text-primary border border-primary/30">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-[10px] leading-relaxed text-gray-300 opacity-0 transition-all duration-500 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    {item.desc}
                  </p>
                </div>
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