import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface HistoricoEntry {
  moeda: string;
  valor: number;
  data: string;
}

const COLORS = ['#00FF41', '#00CC33', '#66FF88', '#33CCAA', '#00AAFF', '#FF6644', '#FFAA00', '#CC44FF'];

export default function TimelineChart() {
  const [chartData, setChartData] = useState<Record<string, string | number>[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('historico_cambio')
        .select('moeda, valor, data')
        .order('data', { ascending: true });

      if (!data || data.length === 0) return;

      const entries = data as HistoricoEntry[];
      const uniqueCurrencies = [...new Set(entries.map((e) => e.moeda))];
      setCurrencies(uniqueCurrencies);

      // Group by date
      const dateMap: Record<string, Record<string, number>> = {};
      entries.forEach((entry) => {
        const dateKey = format(new Date(entry.data), 'dd/MM');
        if (!dateMap[dateKey]) dateMap[dateKey] = {};
        dateMap[dateKey][entry.moeda] = entry.valor;
      });

      const formatted = Object.entries(dateMap).map(([date, values]) => ({
        date,
        ...values,
      }));

      setChartData(formatted);
    };
    fetchData();
  }, []);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
        <p className="text-sm text-muted-foreground">Dados históricos não disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 18%)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'hsl(0 0% 69%)', fontSize: 12 }}
            stroke="hsl(0 0% 18%)"
          />
          <YAxis
            tick={{ fill: 'hsl(0 0% 69%)', fontSize: 12 }}
            stroke="hsl(0 0% 18%)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(0 0% 11.8%)',
              border: '1px solid hsl(0 0% 18%)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ color: 'hsl(0 0% 69%)' }} />
          {currencies.map((currency, idx) => (
            <Line
              key={currency}
              type="monotone"
              dataKey={currency}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
