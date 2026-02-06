import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lightbulb } from 'lucide-react';

interface InsightData {
  id: string;
  insight_especialista: string | null;
}

export default function ExpertInsights() {
  const [insights, setInsights] = useState<InsightData[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('noticias_b2b')
        .select('id, insight_especialista')
        .not('insight_especialista', 'is', null)
        .order('publicado_em', { ascending: false })
        .limit(6);
      if (data) setInsights(data as InsightData[]);
    };
    fetch();
  }, []);

  if (insights.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Lightbulb className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Nenhum insight exclusivo disponível.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, idx) => (
        <div
          key={insight.id}
          className="rounded-xl border border-primary/20 bg-primary/5 p-5 transition-all hover:border-primary/40"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              Insight Premium
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {insight.insight_especialista}
          </p>
        </div>
      ))}
    </div>
  );
}
