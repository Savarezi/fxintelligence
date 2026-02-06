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
  publicado_em: string | null;
  url_imagem: string | null;
  url_noticia: string | null;
}

export default function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('noticias_b2b')
        .select('id, titulo, fonte, setor, publicado_em, url_imagem, url_noticia')
        .order('publicado_em', { ascending: false })
        .limit(9);
      if (data) setNoticias(data as Noticia[]);
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-card" />
        ))}
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <Newspaper className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhuma notícia disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {noticias.map((noticia, idx) => (
        <a
          key={noticia.id}
          href={noticia.url_noticia ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:glow-green"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {noticia.url_imagem && (
            <div className="relative h-44 overflow-hidden">
              <img
                src={noticia.url_imagem}
                alt={noticia.titulo}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
          )}

          <div className="p-5">
            {noticia.setor && (
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {noticia.setor}
              </span>
            )}
            <h3 className="mb-3 text-sm font-semibold leading-snug text-foreground line-clamp-3 group-hover:text-primary transition-colors">
              {noticia.titulo}
            </h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{noticia.fonte ?? 'Fonte'}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {noticia.publicado_em
                    ? format(new Date(noticia.publicado_em), "dd MMM yyyy", { locale: ptBR })
                    : '—'}
                </span>
              </div>
            </div>
            <ExternalLink className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </a>
      ))}
    </div>
  );
}
