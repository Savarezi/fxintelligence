import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightLeft } from 'lucide-react';

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
    
    // 1. Tenta achar o par direto (Ex: USD -> BRL)
    const taxaDireta = historico.find(
      (h) => h.moeda_base === fromCurrency && h.moeda_destino === toCurrency
    );

    if (taxaDireta) {
      const converted = parseFloat(amount) * taxaDireta.valor_cambio;
      setResult(converted);
    } else {
      // 2. Tenta o inverso (Ex: BRL -> USD)
      const taxaInversa = historico.find(
        (h) => h.moeda_base === toCurrency && h.moeda_destino === fromCurrency
      );

      if (taxaInversa) {
        const converted = parseFloat(amount) / taxaInversa.valor_cambio;
        setResult(converted);
      } else {
        // 3. Lógica de Ponte (Especial para converter EUR -> BRL usando USD como base)
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

    // Grava o log (mantendo sua regra original)
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
    /* SEÇÃO COM FUNDO TECNOLÓGICO VERDE E DARK */
    <section className="relative w-full py-16 px-4 overflow-hidden rounded-3xl">
      {/* Imagem de Fundo Estilo Tecnologia/Dados */}
      <img 
        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600" 
        alt="Fundo Tecnológico" 
        className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
      />
      {/* Gradiente Dark e Verde */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-black/80 to-black" />
      
      {/* Conteúdo do Conversor */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Conversor <span className="text-gradient-green">Real FX</span>
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
                Valor para converter
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-lg font-mono text-white outline-none transition-colors focus:border-primary"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">De</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none"
                >
                  {currencies.length > 0 ? currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) : <option>Carregando...</option>}
                </select>
              </div>

              <button
                onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); setResult(null); }}
                className="mb-1 rounded-full border border-white/10 bg-zinc-800 p-2 text-primary hover:bg-primary/20"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">Para</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none"
                >
                  {currencies.length > 0 ? currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) : <option>Carregando...</option>}
                </select>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={loading || !amount || currencies.length === 0}
              className="w-full rounded-lg bg-primary py-4 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              {loading ? 'Consultando Banco...' : 'Converter Agora'}
            </button>
          </div>
        </div>

        {result !== null && (
          <div className="mt-6 animate-fade-in-up rounded-2xl border border-primary/30 bg-black/80 backdrop-blur-md p-6 text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <p className="mb-1 text-sm text-gray-400">Resultado do seu Banco</p>
            <p className="text-4xl font-bold font-mono text-white">
              {result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="ml-2 text-lg text-gray-500">{toCurrency}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}