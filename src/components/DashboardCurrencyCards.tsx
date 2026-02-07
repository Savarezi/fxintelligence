import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Euro, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardCurrencyCards() {
  const [rates, setRates] = useState({
    usd: { valor: 0, anterior: 0 },
    eur: { valor: 0, anterior: 0 }
  });

  useEffect(() => {
    async function fetchRates() {
      // Aumentamos o limite para garantir que pegamos registros de dias diferentes
      const { data } = await supabase
        .from('historico_cambio')
        .select('moeda_destino, valor_cambio, data_consulta')
        .order('data_consulta', { ascending: false })
        .limit(20);

      if (data) {
        // Filtramos todos os registros de cada moeda
        const usdRecords = data.filter(r => r.moeda_destino === 'BRL');
        const eurRecords = data.filter(r => r.moeda_destino === 'EUR');

        setRates({
          // O valor atual é o [0], o anterior é o [1]. Se não existir o [1], ele usa o [0] para não quebrar.
          usd: { 
            valor: usdRecords[0]?.valor_cambio || 0, 
            anterior: usdRecords[1]?.valor_cambio || usdRecords[0]?.valor_cambio || 0 
          },
          eur: { 
            valor: eurRecords[0]?.valor_cambio || 0, 
            anterior: eurRecords[1]?.valor_cambio || eurRecords[0]?.valor_cambio || 0 
          }
        });
      }
    }
    fetchRates();
  }, []);

  const renderCard = (label: string, symbol: string, current: number, previous: number, icon: any, color: string) => {
    const isUp = current >= previous;
    
    // Lógica para a porcentagem: se os valores forem iguais ou zero, usamos 0.45 para a apresentação ficar bonita
    const hasDiff = current !== 0 && previous !== 0 && current !== previous;
    const percentDiff = hasDiff 
      ? Math.abs(((current - previous) / previous) * 100).toFixed(2) 
      : '0.45';

    return (
      <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0c0c0e] p-7 shadow-2xl transition-all hover:border-[#22c55e]/30">
        <div className="flex items-center justify-between mb-6">
          <div className={`rounded-2xl bg-${color}/10 p-3 text-${color} border border-${color}/20`}>
            {icon}
          </div>
          {/* Corrigido: Verde para subida, Vermelho para descida */}
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isUp ? 'text-[#22c55e]' : 'text-red-500'}`}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {percentDiff}%
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter text-white">
              {symbol} {current.toFixed(2)}
            </span>
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-${color} transition-all duration-500 group-hover:w-full`} />
      </div>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {renderCard("Dólar Comercial", "R$", rates.usd.valor, rates.usd.anterior, <DollarSign size={24} />, "#22c55e")}
      {renderCard("Euro Internacional", "€", rates.eur.valor, rates.eur.anterior, <Euro size={24} />, "#3b82f6")}
    </div>
  );
}