import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { X, Activity, Info, Globe, BarChart3 } from "lucide-react";

export const MarketIntelModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [commodities, setCommodities] = useState<any[]>([]);
  const [cotacoesExibicao, setCotacoesExibicao] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // 1. Busca Commodities (Petróleo, Soja, Diesel)
          const { data: commData } = await supabase.from('commodities').select('*');
          setCommodities(commData || []);

          // 2. Busca a lista oficial de ativos (Nomes amigáveis)
          const { data: ativosLista } = await supabase.from('ativos').select('ticker, nome');

          // 3. Busca cotações: Ordenamos pela data_hora mais recente e filtramos apenas preços > 0
          const { data: cotData } = await supabase
            .from('cotacoes')
            .select('*')
            .gt('preco', 0)
            .order('data_hora', { ascending: false });

          if (ativosLista && cotData) {
            // Cruzamos os dados para garantir que pegamos apenas o preço mais recente de cada ticker
            const listaFinal = ativosLista.map(ativo => {
              const ultimaCotacaoValida = cotData.find(c => c.ticker === ativo.ticker);
              return {
                ticker: ativo.ticker,
                nome: ativo.nome,
                preco: ultimaCotacaoValida ? ultimaCotacaoValida.preco : null,
                variacao: ultimaCotacaoValida ? ultimaCotacaoValida.variacao : 0
              };
            }).filter(item => item.preco !== null); // Oculta o que não tiver cotação válida

            setCotacoesExibicao(listaFinal);
          }
        } catch (err) {
          console.error("Erro na busca de dados:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 font-mono text-white">
      <div className="bg-[#020817] border-2 border-[#22c55e]/30 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(34,197,94,0.25)]">
        
        {/* Cabeçalho do Terminal */}
        <div className="flex justify-between items-center p-8 border-b border-[#22c55e]/20 sticky top-0 bg-[#020817] z-10">
          <div>
            <h2 className="text-2xl font-black text-[#22c55e] italic tracking-tighter uppercase flex items-center gap-3"> 
              <Activity className={loading ? "animate-spin" : "animate-pulse"} /> TERMINAL_DE_INTELIGÊNCIA
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-red-500">
            <X size={32} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Guia de Explicação para o Usuário */}
          <section className="bg-[#22c55e]/5 border border-[#22c55e]/20 p-6 rounded-2xl flex gap-4">
            <Info className="text-[#22c55e] shrink-0" size={24} />
            <div>
              <h4 className="text-[#22c55e] font-black text-xs uppercase mb-1">Entendendo os Indicadores</h4>
              <p className="text-gray-400 text-xs leading-relaxed italic">
                As <strong>Commodities</strong> (Petróleo, Soja, Diesel) são cotadas em <strong>USD (Dólar)</strong>. 
                Os <strong>Ativos B3</strong> (Ações) mostram o valor em <strong>R$ (Real)</strong> e a variação percentual do dia.
              </p>
            </div>
          </section>

          {loading ? (
            <div className="text-center py-20 text-[#22c55e] animate-pulse">SINCRONIZANDO COM MERCADO GLOBAL...</div>
          ) : (
            <>
              {/* Seção Commodities */}
              <section>
                <h3 className="text-[#22c55e] font-black text-sm uppercase mb-6 tracking-widest flex items-center gap-2">
                  <Globe size={18} /> Commodities Internacionais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {commodities.map((item, idx) => (
                    <div key={idx} className="bg-black/40 border border-[#22c55e]/10 p-5 rounded-3xl hover:border-[#22c55e]/50 transition-all">
                      <p className="text-gray-500 text-[10px] uppercase font-black">{item.nome}</p>
                      <p className="text-2xl font-black text-white italic">USD {Number(item.preco).toFixed(2)}</p>
                      <p className="text-[#22c55e] text-[9px] mt-2 opacity-60 font-bold uppercase">{item.unidade}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Seção Ativos B3 */}
              <section>
                <h3 className="text-[#22c55e] font-black text-sm uppercase mb-6 tracking-widest flex items-center gap-2">
                  <BarChart3 size={18} /> Monitoramento B3 (Ações)
                </h3>
                <div className="overflow-hidden border border-[#22c55e]/10 rounded-3xl bg-black/20 text-white">
                  <table className="w-full text-left">
                    <thead className="bg-[#22c55e]/5 text-[#22c55e] text-[10px] uppercase font-black">
                      <tr>
                        <th className="p-5">Nome do Ativo</th>
                        <th className="p-5 text-right">Preço (BRL)</th>
                        <th className="p-5 text-right">Variação %</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {cotacoesExibicao.map((item, idx) => (
                        <tr key={idx} className="border-t border-[#22c55e]/5 hover:bg-white/5 transition-all">
                          <td className="p-5">
                            <p className="font-black text-white text-sm uppercase">{item.nome}</p>
                            <p className="text-[#22c55e] text-[10px] font-bold">{item.ticker}</p>
                          </td>
                          <td className="p-5 text-right font-black text-white italic text-lg">
                            R$ {Number(item.preco).toFixed(2)}
                          </td>
                          <td className={`p-5 text-right font-black italic ${Number(item.variacao) >= 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>
                            {Number(item.variacao) > 0 ? '+' : ''}{Number(item.variacao).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};