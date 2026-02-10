import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Clock, Newspaper, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Noticia {
  id: string;
  titulo: string;
  fonte: string | null;
  setor: string | null;
  criado_at: string | null; 
  url_imagem: string | null;
  link: string | null; 
}

export default function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('noticias_b2b')
        .select('id, titulo, fonte, setor, criado_at, url_imagem, link')
        .order('criado_at', { ascending: false })
        .limit(9);
      
      if (error) {
        console.error("Erro ao carregar notícias:", error);
      } else if (data) {
        setNoticias(data as Noticia[]);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center w-full">
        <div className="h-[500px] w-full max-w-4xl animate-pulse rounded-2xl bg-card border border-border" />
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <Newspaper className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhuma notícia encontrada no seu banco.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full gap-8">
      {/* TEXTO DE AVISO QUE VOCÊ PEDIU */}
      <div className="w-full max-w-4xl text-center mb-4 space-y-2">
        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
          <Zap className="h-4 w-4 fill-primary" /> Atualizado em Tempo Real
        </div>
        <p className="text-muted-foreground text-lg">
          As principais movimentações do mercado. Todos os <strong>insights detalhados</strong> desta notícia já estão disponíveis no seu <strong>Dashboard</strong>.
        </p>
      </div>

      {/* GRID DINÂMICO: Se tiver 1 notícia, ela fica centralizada e larga. Se tiver mais, elas se organizam. */}
      <div className={`grid gap-8 w-full ${noticias.length === 1 ? 'max-w-4xl grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {noticias.map((noticia, idx) => (
          <a
            key={noticia.id}
            href={noticia.link ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {noticia.url_imagem && (
              <div className="relative h-[400px] w-full overflow-hidden bg-muted">
                <img
                  src={noticia.url_imagem}
                  alt={noticia.titulo}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {noticia.setor && (
                  <div className="absolute left-6 top-6">
                    <span className="rounded-lg bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-xl">
                      {noticia.setor}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-1 flex-col p-8">
              <div className="mb-4 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  {noticia.criado_at
                    ? format(new Date(noticia.criado_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
                    : 'Recém postado'}
                </span>
                <span>•</span>
                <span className="uppercase tracking-widest font-bold">{noticia.fonte ?? 'FX Intelligence'}</span>
              </div>

              <h3 className="mb-8 text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                {noticia.titulo}
              </h3>

              <div className="mt-auto flex items-center font-black text-primary text-sm tracking-widest">
                LEIA A ANÁLISE COMPLETA NO DASHBOARD
                <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}