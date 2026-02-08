import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export default function TimelineChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: res } = await supabase
          .from("historico_cambio")
          .select("data_consulta, moeda_destino, valor_cambio")
          .order("data_consulta", { ascending: true })
          .limit(100);

        if (res && res.length > 0) {
          const formattedData = res.reduce((acc: any, item: any) => {
            const dateObj = new Date(item.data_consulta);
            const label = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + 
                          " " + dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const point = {
              date: label,
              dolar: item.moeda_destino === "BRL" ? item.valor_cambio : null,
              euro: item.moeda_destino === "EUR" ? item.valor_cambio : null,
            };
            
            acc.push(point);
            return acc;
          }, []);
          setData(formattedData);
        }
      } catch (err) {
        console.error("Erro no gráfico:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-black p-8 rounded-xl border border-[#22c55e]/30 w-full shadow-[0_0_30px_-10px_rgba(34,197,94,0.2)] font-mono">
      {/* Título e Subtítulo Estilo Terminal Dev */}
      <div className="mb-8 border-l-4 border-[#22c55e] pl-4">
        <h2 className="text-2xl font-bold text-[#22c55e] tracking-tighter uppercase">
          &gt; MONITORAMENTO_CAMBIAL_LOG
        </h2>
        <p className="text-gray-500 text-xs mt-1 uppercase tracking-[0.2em]">
          Status: Sistema Ativo // Sincronização em tempo real
        </p>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Degradê Verde Matrix */}
              <linearGradient id="colorDolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              {/* Degradê Cinza Escuro (para o Euro não brigar com o verde) */}
              <linearGradient id="colorEuro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4b5563" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#4b5563" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#22c55e" strokeOpacity={0.05} vertical={false} />
            <XAxis dataKey="date" hide={true} />
            <YAxis 
              stroke="#22c55e" 
              strokeOpacity={0.5}
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={['auto', 'auto']}
              tickFormatter={(val) => `R$ ${val.toFixed(2)}`}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#000', 
                border: '1px solid #22c55e', 
                borderRadius: '4px',
                color: '#22c55e',
                fontFamily: 'monospace'
              }}
            />
            
            <Legend verticalAlign="top" align="right" />
            
            {/* Dólar em Verde Neon */}
            <Area 
              type="monotone" 
              dataKey="dolar" 
              name="USD_BRL" 
              stroke="#22c55e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDolar)" 
              connectNulls 
            />
            
            {/* Euro em Cinza/Dark Silver */}
            <Area 
              type="monotone" 
              dataKey="euro" 
              name="EUR_BRL" 
              stroke="#4b5563" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEuro)" 
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}