import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function TimelineChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const { data: rawData } = await supabase
        .from('historico_cambio')
        .select('data_consulta, valor_cambio, moeda_destino')
        .order('data_consulta', { ascending: true });

      if (rawData) {
        const groups = rawData.reduce((acc: any, item) => {
          const date = new Date(item.data_consulta).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
          });
          if (!acc[date]) acc[date] = { name: date };
          if (item.moeda_destino === 'BRL') acc[date].dolar = item.valor_cambio;
          if (item.moeda_destino === 'EUR') acc[date].euro = item.valor_cambio;
          return acc;
        }, {});
        setData(Object.values(groups));
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* CABEÇALHO MINIMALISTA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#22c55e]">
            Análise de Tendência Cambial
          </h2>
          <p className="max-w-2xl text-[11px] leading-relaxed text-gray-500 mt-1 uppercase font-medium">
            Comparativo de volatilidade USD/BRL e USD/EUR. Dados processados em tempo real para suporte à decisão de importação e hedge.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Status: </span>
          <span className="text-[10px] font-bold text-[#22c55e] uppercase animate-pulse">Live Data</span>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO LIMPA */}
      <div className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineDolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="lineEuro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#4b5563', fontSize: 10, fontWeight: '600'}}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{fill: '#4b5563', fontSize: 10}}
              domain={['auto', 'auto']} 
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0c0c0e', 
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '11px',
                textTransform: 'uppercase'
              }}
              itemStyle={{ fontWeight: '800' }}
            />

            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="rect"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}
            />

            <Area 
              type="monotone" 
              dataKey="dolar" 
              name="USD / BRL"
              stroke="#22c55e" 
              strokeWidth={2}
              fill="url(#lineDolar)" 
            />

            <Area 
              type="monotone" 
              dataKey="euro" 
              name="USD / EUR"
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#lineEuro)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}