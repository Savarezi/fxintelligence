import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  valor: number | null;
  unidade: string | null;
  variacao: number | null;
}

export default function ProductCards() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('produtos_globais').select('*');
      if (data) setProdutos(data as Produto[]);
    };
    fetch();
  }, []);

  if (produtos.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Nenhum produto disponível.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => {
        const v = produto.variacao ?? 0;
        return (
          <div
            key={produto.id}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
          >
            <div className="mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{produto.nome}</span>
            </div>
            <p className="font-mono text-xl font-bold">
              {produto.valor != null
                ? `$${produto.valor.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : '—'}
              {produto.unidade && (
                <span className="ml-1 text-xs text-muted-foreground">/{produto.unidade}</span>
              )}
            </p>
            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${
              v > 0 ? 'text-primary' : v < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {v > 0 ? <TrendingUp className="h-3 w-3" /> : v < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {v.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
