import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightLeft, Calculator, Zap } from 'lucide-react';

interface HistoricoCambio {
  moeda_base: string;
  moeda_destino: string;
  valor_cambio: number;
  data_consulta: string;
}

export default function CurrencyConverter() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [historico, setHistorico] = useState<HistoricoCambio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_cambio')
        .select('moeda_base, moeda_destino, valor_cambio, data_consulta')
        .order('data_consulta', { ascending: false });

      if (error) {
        console.error("Erro ao buscar dados reais:", error);
      } else if (data) {
        setHistorico(data as HistoricoCambio[]);
      }
      setLoading(false);
    };
    fetchRealData();
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    
    const taxaDireta = historico.find(
      (h) => h.moeda_base === fromCurrency && h.moeda_destino === toCurrency
    );

    if (taxaDireta) {
      const converted = parseFloat(amount) * taxaDireta.valor_cambio;
      setResult(converted);
    } else {
      const taxaInversa = historico.find(
        (h) => h.moeda_base === toCurrency && h.moeda_destino === fromCurrency
      );

      if (taxaInversa) {
        const converted = parseFloat(amount) / taxaInversa.valor_cambio;
        setResult(converted);
      } else {
        const taxaUSD_From = historico.find(h => h.moeda_base === 'USD' && h.moeda_destino === fromCurrency);
        const taxaUSD_To = historico.find(h => h.moeda_base === 'USD' && h.moeda_destino === toCurrency);

        if (taxaUSD_From && taxaUSD_To) {
          const valorEmUSD = parseFloat(amount) / taxaUSD_From.valor_cambio;
          const finalResult = valorEmUSD * taxaUSD_To.valor_cambio;
          setResult(finalResult);
        } else {
          alert("Cotação não encontrada no banco para este par.");
        }
      }
    }

    await supabase.from('logs_consultas_usuario').insert({
      user_id: user?.id ?? null,
      moeda: toCurrency,
      data_consulta: new Date().toISOString(),
    });

    setLoading(false);
  };

  const currencies = [
    ...new Set([
      ...historico.map((h) => h.moeda_base),
      ...historico.map((h) => h.moeda_destino),
    ]),
  ].filter(Boolean);

  return (
    <div className="relative w-full max-w-xl mx-auto group">
      {/* CSS para as Setas do Input e Animação da Luz Verde */}
      <style dangerouslySetInnerHTML={{ __html: `
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          opacity: 1 !important;
          filter: invert(1);
          cursor: pointer;
        }
        @keyframes custom-pulse {
          0% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7); }
          70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 6px rgba(0, 255, 136, 0); }
          100% { transform: scale(0.95); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
        }
        .animate-live-db {
          animation: custom-pulse 2s infinite;
        }
      `}} />

      <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88]/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative rounded-[2rem] border border-white/10 bg-[#0d0d0d]/80 backdrop-blur-2xl p-8 shadow-3xl overflow-hidden">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <Calculator className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Conversor <span className="text-[#00ff88]">Real FX</span>
            </h2>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
             {/* A LUZ VERDE AGORA COM CLASSE CUSTOMIZADA */}
             <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-live-db" />
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live DB</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Valor para Conversão
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-2xl font-mono font-bold text-white outline-none transition-all focus:border-[#00ff88]/50 focus:bg-white/[0.08]"
                placeholder="0.00"
              />
              <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-600 font-bold">{fromCurrency}</span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Origem</label>
              <select
                value={fromCurrency}
                onChange={(e) => {setFromCurrency(e.target.value); setResult(null);}}
                className="w-full rounded-xl border border-white/5 bg-[#1a1a1a] px-4 py-3 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-[#00ff88]/50 cursor-pointer"
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button
              onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); setResult(null); }}
              className="mt-6 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:text-[#00ff88] transition-all active:scale-90"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Destino</label>
              <select
                value={toCurrency}
                onChange={(e) => {setToCurrency(e.target.value); setResult(null);}}
                className="w-full rounded-xl border border-white/5 bg-[#1a1a1a] px-4 py-3 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-[#00ff88]/50 cursor-pointer"
              >
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !amount || currencies.length === 0}
            className="group relative w-full overflow-hidden rounded-2xl bg-[#00ff88] py-5 font-black text-black uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] disabled:opacity-50"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Converter Agora</span>
                </>
              )}
            </div>
          </button>
        </div>

        {result !== null && (
          <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Resultado da Cotação</span>
              <span className="text-[#00ff88]">Sucesso</span>
            </div>
            <div className="bg-gradient-to-r from-white/[0.03] to-transparent p-6 rounded-2xl border border-white/5">
              <p className="text-4xl font-mono font-black text-white tracking-tighter">
                {result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="ml-3 text-lg text-[#00ff88]">{toCurrency}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}