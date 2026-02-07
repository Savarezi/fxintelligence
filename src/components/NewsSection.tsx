import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Clock, Newspaper } from 'lucide-react';
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
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[450px] animate-pulse rounded-2xl bg-card border border-border" />
        ))}
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
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {noticias.map((noticia, idx) => (
        <a
          key={noticia.id}
          href={noticia.link ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/60 hover:shadow-2xl hover:-translate-y-1"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* FOTO AMPLIADA: Aumentei para h-80 (320px de altura) */}
          {noticia.url_imagem && (
            <div className="relative h-80 w-full overflow-hidden bg-muted">
              <img
                src={noticia.url_imagem}
                alt={noticia.titulo}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              {/* Degradê sutil para as cores não ficarem "lavadas" */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Etiqueta de Setor flutuando sobre a imagem maior */}
              {noticia.setor && (
                <div className="absolute left-4 top-4">
                  <span className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-primary-foreground shadow-xl">
                    {noticia.setor}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {noticia.criado_at
                  ? format(new Date(noticia.criado_at), "dd 'de' MMM, yyyy", { locale: ptBR })
                  : 'Recém postado'}
              </span>
              <span>•</span>
              <span className="uppercase tracking-tighter">{noticia.fonte ?? 'FX Intelligence'}</span>
            </div>

            <h3 className="mb-6 text-xl font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {noticia.titulo}
            </h3>

            <div className="mt-auto flex items-center font-bold text-primary text-sm">
              LEIA A ANÁLISE COMPLETA
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}