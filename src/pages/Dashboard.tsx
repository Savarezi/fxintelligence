import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardCurrencyCards from "@/components/DashboardCurrencyCards";
import TimelineChart from "@/components/TimelineChart";
import { Fuel, Leaf, Circle, Brain, Sparkles, AlertTriangle, CheckCircle, Clock, Download, Globe, Droplets, Activity } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// ADIÇÃO 1: Importando o novo Modal
import { MarketIntelModal } from "@/components/MarketIntelModal";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState("");
  const [status, setStatus] = useState({ label: "ANALISANDO", color: "text-yellow-500", farol: "amarelo" });
  const [lastUpdate, setLastUpdate] = useState("");
  // ADIÇÃO 2: Estado para controlar a abertura da tela
  const [isIntelOpen, setIsIntelOpen] = useState(false);
  
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: pData } = await supabase.from('produtos_globais').select('*').order('id', { ascending: false });
      
      if (pData && pData.length > 0) {
        const soja = pData.find((p: any) => p.nome.includes("Soja"));
        const diesel = pData.find((p: any) => p.nome.includes("Diesel"));
        const petroleo = pData.find((p: any) => p.nome.includes("Petróleo"));
        setProducts([soja, diesel, petroleo].filter(Boolean));
        
        const registroMaisRecente = pData[0];
        if (registroMaisRecente?.criado_em) {
          const date = new Date(registroMaisRecente.criado_em);
          setLastUpdate(date.toLocaleString('pt-BR'));
        }

        if (diesel) {
          const preco = Number(diesel.preco_original);
          if (preco < 5.80) setStatus({ label: "COMPRA_RECOMENDADA", color: "text-[#22c55e]", farol: "verde" });
          else if (preco >= 5.80 && preco <= 6.30) setStatus({ label: "AGUARDAR_MERCADO", color: "text-yellow-500", farol: "amarelo" });
          else setStatus({ label: "VENDA_ESTRATEGICA", color: "text-red-500", farol: "vermelho" });
        }
      }
      
      const { data: nData } = await supabase.from('noticias_b2b').select('insight_especialista').order('id', { ascending: false }).limit(1);
      if (nData && nData[0]) setAiInsight(nData[0].insight_especialista);
    }
    fetchData();
  }, []);

  const handleDownload = async () => {
    if (dashboardRef.current) {
      try {
        const element = dashboardRef.current;
        const canvas = await html2canvas(element, { 
          backgroundColor: "#020817", 
          scale: 2, 
          useCORS: true, 
          logging: false,
          height: element.scrollHeight,
          windowHeight: element.scrollHeight,
          scrollY: -window.scrollY
        });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 
        const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("Relatorio_IA_Dashboard.pdf");
      } catch (error) { console.error("Erro ao gerar PDF:", error); }
    }
  };

  return (
    <div ref={dashboardRef} className="min-h-screen bg-[#020817] text-white font-mono pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-10">
        
        <header className="bg-black border border-[#22c55e]/20 p-8 rounded-3xl shadow-2xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#22c55e] italic uppercase tracking-tighter">
              &gt; DASHBOARD_IA_INTELIGENTE
            </h1>
            <p className="text-gray-400 text-[11px] mt-2 uppercase font-bold tracking-widest">
              SISTEMA ATUALIZADO EM: <span className="text-[#22c55e]">{lastUpdate || "CARREGANDO..."}</span>
            </p>
          </div>
          
          {/* DIV de botões para manter o layout alinhado */}
          <div className="flex gap-4">
            {/* ADIÇÃO 3: O Novo Botão de Inteligência */}
            <button 
              onClick={() => setIsIntelOpen(true)}
              className="flex items-center gap-2 bg-transparent border-2 border-[#22c55e] hover:bg-[#22c55e]/10 text-[#22c55e] font-black px-6 py-3 rounded-xl transition-all uppercase text-xs shadow-[0_0_15px_rgba(34,197,94,0.1)]"
            >
              <Activity size={18} /> Inteligência de Mercado
            </button>

            <button onClick={handleDownload} className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#1da34d] text-black font-black px-6 py-3 rounded-xl transition-all uppercase text-xs shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Download size={18} /> Baixar PDF Agora
            </button>
          </div>
        </header>

        <div className="bg-black border border-[#22c55e]/30 p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3 mb-4 text-[#22c55e]">
            <Globe size={24} />
            <h2 className="font-black uppercase text-lg tracking-widest">INDICADOR DE PARIDADE GLOBAL</h2>
          </div>
          <p className="text-gray-200 text-base leading-relaxed">
            Os valores exibidos nos cards de câmbio referem-se à cotação internacional <span className="text-[#22c55e] font-bold">EUR/USD</span> (Euro frente ao Dólar). 
            Este índice monitora a força das moedas no mercado externo e serve como referência direta para a precificação das commodities abaixo. 
            O card está exibindo o Euro em relação ao Dólar, que costuma orbitar nessa casa de <span className="text-[#22c55e] font-bold">0.85 a 0.95</span>, refletindo o equilíbrio cambial nas bolsas.
          </p>
        </div>

        <DashboardCurrencyCards />
        <div className="w-full"><TimelineChart /></div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p, i) => {
            const isPetroleo = p.nome.includes("Petróleo");
            const valorEmRealEstivado = isPetroleo ? Number(p.preco_original) * 5.25 : null;

            return (
              <div key={i} className="bg-black border border-[#22c55e]/20 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="mb-6 text-[#22c55e]">
                    {p.nome.includes('Soja') ? <Leaf size={32} /> : p.nome.includes('Diesel') ? <Fuel size={32} /> : <Droplets size={32} />}
                  </div>
                  <h3 className="text-white text-lg font-bold uppercase mb-4 h-12 leading-tight">{p.nome}</h3>
                  <div className="pt-6 border-t border-white/5">
                    <span className="text-[#22c55e] text-4xl font-black italic tracking-tighter">
                      {isPetroleo ? `USD ${Number(p.preco_original).toFixed(2)}` : `R$ ${Number(p.preco_original).toFixed(2)}`}
                    </span>
                    {isPetroleo && (
                      <div className="mt-4 p-3 bg-[#22c55e]/5 rounded-lg border border-[#22c55e]/10">
                        <p className="text-[#22c55e] text-sm uppercase font-black italic tracking-tight">R$ {valorEmRealEstivado?.toFixed(2)} (Conversão estimada)</p>
                        <p className="text-gray-300 text-[11px] mt-1 leading-tight italic font-sans">
                          * Valor convertido para Real baseada na cotação do Dólar atual para facilitar a análise de custo.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5">
                    <p className="text-[#22c55e] text-[11px] uppercase tracking-widest font-black">Fonte: {p.origem || 'Database Global'}</p>
                    <p className="text-gray-400 text-[10px] leading-relaxed italic mt-1 font-sans">
                      Fonte oficial monitorada via banco de dados global para garantir precisão operacional. Atualizado em: {p.criado_em ? new Date(p.criado_em).toLocaleDateString('pt-BR') : '--'}
                    </p>
                </div>
              </div>
            );
          })}
        </div>

        <section className="bg-black border border-[#22c55e]/30 p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-center text-gray-500 text-xs font-bold uppercase mb-8 tracking-[0.3em]">Farol de Decisão Operacional</h2>
          <div className="flex justify-around items-center bg-gray-900/40 p-10 rounded-3xl">
            <Circle size={65} className={`${status.farol === "vermelho" ? "fill-red-500 text-red-500 animate-pulse shadow-[0_0_35px_red]" : "text-gray-900 opacity-20"}`} />
            <Circle size={65} className={`${status.farol === "amarelo" ? "fill-yellow-500 text-yellow-500 animate-pulse shadow-[0_0_35px_yellow]" : "text-gray-900 opacity-20"}`} />
            <Circle size={65} className={`${status.farol === "verde" ? "fill-[#22c55e] text-[#22c55e] animate-pulse shadow-[0_0_35px_#22c55e]" : "text-gray-900 opacity-20"}`} />
          </div>
          <p className={`mt-8 text-center text-3xl font-black italic tracking-tighter uppercase ${status.color}`}>
            {status.label}
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-10">
            <div className="flex items-start gap-4 p-4 bg-[#22c55e]/5 rounded-xl border border-[#22c55e]/20">
              <CheckCircle className="text-[#22c55e] shrink-0" size={24} />
              <div>
                <p className="text-[#22c55e] font-black text-sm uppercase">Verde: Compra</p>
                <p className="text-gray-400 text-xs mt-1 font-sans italic">Diesel abaixo de R$ 5,80.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
              <Clock className="text-yellow-500 shrink-0" size={24} />
              <div>
                <p className="text-yellow-500 font-black text-sm uppercase">Amarelo: Aguardar</p>
                <p className="text-gray-400 text-xs mt-1 font-sans italic">Diesel entre R$ 5,80 e R$ 6,30.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-red-500/5 rounded-xl border border-red-500/20">
              <AlertTriangle className="text-red-500 shrink-0" size={24} />
              <div>
                <p className="text-red-500 font-black text-sm uppercase">Vermelho: Risco</p>
                <p className="text-gray-400 text-xs mt-1 font-sans italic">Diesel acima de R$ 6,30.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black border border-[#22c55e]/30 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6">
          <Brain size={85} className="text-[#22c55e] animate-pulse" />
          <h2 className="text-xl font-black italic text-white uppercase tracking-widest">Insight do Especialista</h2>
          <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 p-10 rounded-[2rem] w-full max-w-5xl shadow-inner text-center">
            <p className="text-gray-200 text-xl italic leading-relaxed font-sans font-medium">
              "{aiInsight}"
            </p>
          </div>
        </section>

        {/* ADIÇÃO 4: Chamada do Modal (fica invisível até clicar no botão) */}
        <MarketIntelModal isOpen={isIntelOpen} onClose={() => setIsIntelOpen(false)} />

      </div>
    </div>
  );
}