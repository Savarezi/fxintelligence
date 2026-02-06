import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Insight {
  id: string;
  moeda: string | null;
  status: string;
  mensagem: string | null;
}

export default function ImportSemaphore() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('insights_cambio').select('*').order('created_at', { ascending: false });
      if (data) setInsights(data as Insight[]);
    };
    fetch();
  }, []);

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('favoravel') || s.includes('verde') || s.includes('green') || s.includes('favorável'))
      return { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' };
    if (s.includes('alerta') || s.includes('amarelo') || s.includes('yellow') || s.includes('neutro'))
      return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' };
    return { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' };
  };

  if (insights.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Sem insights de câmbio disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {insights.map((insight) => {
        const config = getStatusConfig(insight.status);
        const Icon = config.icon;
        return (
          <div
            key={insight.id}
            className={`rounded-xl border ${config.border} ${config.bg} p-5 transition-all`}
          >
            <div className="mb-2 flex items-center gap-3">
              <Icon className={`h-6 w-6 ${config.color}`} />
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {insight.moeda ?? 'Geral'}
                </span>
                <p className={`text-sm font-semibold ${config.color}`}>{insight.status}</p>
              </div>
            </div>
            {insight.mensagem && (
              <p className="text-sm text-muted-foreground leading-relaxed">{insight.mensagem}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
