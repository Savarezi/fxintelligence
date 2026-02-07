import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRightLeft } from 'lucide-react';

// Ajustado para bater exatamente com a sua foto do banco
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
      // Busca os dados da sua tabela real 'historico_cambio'
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
    
    // Procura na sua tabela o par de moedas selecionado
    const taxaEncontrada = historico.find(
      (h) => h.moeda_base === fromCurrency && h.moeda_destino === toCurrency
    );

    if (taxaEncontrada) {
      const converted = parseFloat(amount) * taxaEncontrada.valor_cambio;
      setResult(converted);

      // Registra que a Patricia ou o usuário consultou algo
      await supabase.from('logs_consultas_usuario').insert({
        user_id: user?.id ?? null,
        moeda: toCurrency,
        data_consulta: new Date().toISOString(),
      });
    } else {
      // Se não achar o par exato (ex: BRL para USD), tentamos o inverso
      const taxaInversa = historico.find(
        (h) => h.moeda_base === toCurrency && h.moeda_destino === fromCurrency
      );
      
      if (taxaInversa) {
        const converted = parseFloat(amount) / taxaInversa.valor_cambio;
        setResult(converted);
      } else {
        alert("Cotação não encontrada no seu banco para este par.");
      }
    }
    setLoading(false);
  };

  // Pega as moedas que existem de verdade no seu banco para mostrar na lista
  const currencies = [
    ...new Set([
      ...historico.map((h) => h.moeda_base),
      ...historico.map((h) => h.moeda_destino),
    ]),
  ].filter(Boolean);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl border border-border bg-surface-gradient p-8 glow-green">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Conversor <span className="text-gradient-green">Real FX</span>
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Valor para converter
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-lg font-mono text-foreground outline-none transition-colors focus:border-primary"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">De</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground outline-none"
              >
                {currencies.length > 0 ? currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                )) : <option>Carregando...</option>}
              </select>
            </div>

            <button
              onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); setResult(null); }}
              className="mb-1 rounded-full border border-border bg-secondary p-2 text-primary hover:bg-primary/10"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Para</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground outline-none"
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
            className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Consultando Banco...' : 'Converter Agora'}
          </button>
        </div>
      </div>

      {result !== null && (
        <div className="mt-6 animate-fade-in-up rounded-2xl border border-primary/30 bg-card p-6 text-center glow-green-strong">
          <p className="mb-1 text-sm text-muted-foreground">Resultado do seu Banco</p>
          <p className="text-4xl font-bold font-mono">
            {result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="ml-2 text-lg text-muted-foreground">{toCurrency}</span>
          </p>
        </div>
      )}
    </div>
  );
}