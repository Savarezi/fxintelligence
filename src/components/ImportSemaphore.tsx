import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle2, XCircle, Zap } from 'lucide-react';

export default function ImportSemaphore() {
  const [status, setStatus] = useState<'green' | 'yellow' | 'red'>('yellow');
  const [value, setValue] = useState(0);

  useEffect(() => {
    async function checkRate() {
      try {
        // Usamos 'as any' para matar o erro de "instanciação profunda" da imagem
        const { data, error }: any = await supabase
          .from('historico_cambio' as any)
          .select('*')
          .eq('moeda_destino', 'BRL')
          .order('data_consulta', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          // Buscamos o valor independente do nome da coluna (valor_cambio ou valor)
          const registro = data[0];
          const val = registro.valor_cambio || registro.valor || 0;
          
          setValue(Number(val));
          
          // Lógica do semáforo
          if (val > 0 && val < 5.10) setStatus('green');
          else if (val >= 5.10 && val < 5.45) setStatus('yellow');
          else setStatus('red');
        }
      } catch (err) {
        console.error("Erro ao carregar semáforo:", err);
      }
    }
    checkRate();
  }, []);

  const config = {
    green: { color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/5', border: 'border-[#22c55e]/20', icon: <CheckCircle2 size={32} />, title: 'Cenário Favorável', desc: 'O câmbio atual apresenta uma janela de oportunidade para nacionalização.' },
    yellow: { color: 'text-yellow-500', bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', icon: <AlertCircle size={32} />, title: 'Atenção Operacional', desc: 'Mercado em zona de volatilidade. Recomenda-se cautela.' },
    red: { color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20', icon: <XCircle size={32} />, title: 'Cenário Crítico', desc: 'Custos de importação elevados. Evite operações spot.' }
  };

  const current = config[status];

  return (
    <div className={`relative overflow-hidden rounded-3xl border ${current.border} ${current.bg} p-8 shadow-2xl`}>
      <div className="absolute -right-10 -top-10 opacity-10">
        <Zap size={150} className={current.color} />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col gap-3">
          <div className={`h-4 w-4 rounded-full ${status === 'red' ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-gray-800'}`} />
          <div className={`h-4 w-4 rounded-full ${status === 'yellow' ? 'bg-yellow-500 shadow-[0_0_15px_yellow]' : 'bg-gray-800'}`} />
          <div className={`h-4 w-4 rounded-full ${status === 'green' ? 'bg-[#22c55e] shadow-[0_0_15px_#22c55e]' : 'bg-gray-800'}`} />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${current.color}`}>Análise de Viabilidade</span>
            <span className="h-[1px] w-12 bg-white/10" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">USD R$ {value.toFixed(2)}</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{current.title}</h2>
          <p className="text-gray-400 max-w-xl font-medium leading-relaxed">{current.desc}</p>
        </div>
        <div className={`hidden md:flex h-20 w-20 items-center justify-center rounded-2xl bg-black/40 border ${current.border} ${current.color}`}>
          {current.icon}
        </div>
      </div>
    </div>
  );
}