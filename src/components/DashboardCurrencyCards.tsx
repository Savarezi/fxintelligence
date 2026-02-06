import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Moeda {
  id: string;
  nome: string;
  sigla: string;
  valor_compra: number | null;
  valor_venda: number | null;
  variacao: number | null;
}

export default function DashboardCurrencyCards() {
  const [moedas, setMoedas] = useState<Moeda[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('moedas').select('*');
      if (data) setMoedas(data as Moeda[]);
    };
    fetch();
  }, []);

  if (moedas.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {moedas.map((moeda) => {
        const variacao = moeda.variacao ?? 0;
        const isUp = variacao > 0;
        const isDown = variacao < 0;

        return (
          <div
            key={moeda.id}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:glow-green"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {moeda.nome}
              </span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-primary">
                {moeda.sigla}
              </span>
            </div>
            <p className="mb-1 font-mono text-2xl font-bold">
              R$ {moeda.valor_compra?.toFixed(4) ?? '—'}
            </p>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              isUp ? 'text-primary' : isDown ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {isUp ? <TrendingUp className="h-3 w-3" /> : isDown ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {variacao.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
