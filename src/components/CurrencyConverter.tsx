import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightLeft } from 'lucide-react';

interface Moeda {
  id: string;
  nome: string;
  sigla: string;
  valor_compra: number | null;
  valor_venda: number | null;
}

interface HistoricoCambio {
  moeda: string;
  valor: number;
  data: string;
}

export default function CurrencyConverter() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [historico, setHistorico] = useState<HistoricoCambio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: moedasData }, { data: historicoData }] = await Promise.all([
        supabase.from('moedas').select('*'),
        supabase.from('historico_cambio').select('moeda, valor, data').order('data', { ascending: false }),
      ]);
      if (moedasData) setMoedas(moedasData as Moeda[]);
      if (historicoData) setHistorico(historicoData as HistoricoCambio[]);
    };
    fetchData();
  }, []);

  const getLatestRate = (sigla: string): number | null => {
    const entry = historico.find((h) => h.moeda === sigla);
    if (entry) return entry.valor;
    const moeda = moedas.find((m) => m.sigla === sigla);
    return moeda?.valor_compra ?? null;
  };

  const handleConvert = async () => {
    setLoading(true);
    const fromRate = getLatestRate(fromCurrency);
    const toRate = getLatestRate(toCurrency);

    if (fromRate && toRate) {
      const converted = (parseFloat(amount) * fromRate) / toRate;
      setResult(converted);

      // Log the query
      await supabase.from('logs_consultas_usuario').insert({
        user_id: user?.id ?? null,
        moeda: toCurrency,
        data_consulta: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const availableCurrencies = [
    ...new Set([
      ...moedas.map((m) => m.sigla),
      ...historico.map((h) => h.moeda),
    ]),
  ].filter(Boolean);

  // Fallback if no data
  const currencies = availableCurrencies.length > 0
    ? availableCurrencies
    : ['USD', 'EUR', 'BRL', 'GBP'];

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl border border-border bg-surface-gradient p-8 glow-green">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Conversor de <span className="text-gradient-green">Moedas</span>
        </h2>

        <div className="space-y-5">
          {/* Amount */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quanto
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-lg font-mono text-foreground outline-none transition-colors focus:border-primary"
              placeholder="1.00"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            {/* From */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                De
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <button
              onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); setResult(null); }}
              className="mb-1 rounded-full border border-border bg-secondary p-2 text-primary transition-colors hover:bg-primary/10"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>

            {/* To */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Para
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !amount}
            className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Convertendo...' : 'Converter'}
          </button>
        </div>
      </div>

      {/* Result */}
      {result !== null && (
        <div className="mt-6 animate-fade-in-up rounded-2xl border border-primary/30 bg-card p-6 text-center glow-green-strong">
          <p className="mb-1 text-sm text-muted-foreground">Resultado</p>
          <p className="text-4xl font-bold font-mono">
            {result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            <span className="ml-2 text-lg text-muted-foreground">{toCurrency}</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {amount} {fromCurrency} = {result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {toCurrency}
          </p>
        </div>
      )}
    </div>
  );
}
