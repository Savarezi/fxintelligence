import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardCurrencyCards from "@/components/DashboardCurrencyCards";
import TimelineChart from "@/components/TimelineChart";
import { Fuel, Leaf, Circle, Brain, Sparkles, AlertTriangle, CheckCircle, Clock, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState("");
  const [status, setStatus] = useState({ label: "ANALISANDO", color: "text-yellow-500", farol: "amarelo" });
  
  // Referência para capturar a tela inteira
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: pData } = await supabase.from('produtos_globais').select('*').order('id', { ascending: false });
      if (pData) {
        const soja = pData.find((p: any) => p.nome.includes("Soja"));
        const diesel = pData.find((p: any) => p.nome.includes("Diesel"));
        const petroleo = pData.find((p: any) => p.nome.includes("Petróleo"));
        setProducts([soja, diesel, petroleo].filter(Boolean));
        if (diesel) {
          const preco = Number(diesel.preco_original);
          if (preco < 5.80) setStatus({ label: "COMPRA_RECOMENDADA", color: "text-[#22c55e]", farol: "verde" });
          else if (preco >= 5.80 && preco <= 6.30) setStatus({ label: "AGUARDAR_MERCADO", color: "text-yellow-500", farol: "amarelo" });
          else setStatus({ label: "VENDA_ESTRATEGICA", color: "text-red-500", farol: "vermelho" });
        }
      }
      const { data: nData } = await supabase.from('noticias_b2b').select('insight_especialista').order('criado_at', { ascending: false }).limit(1);
      if (nData && nData[0]) setAiInsight(nData[0].insight_especialista);
    }
    fetchData();
  }, []);

  // FUNÇÃO DE DOWNLOAD DIRETO (CONVERTE PARA IMAGEM E GERA PDF)
  const handleDownload = async () => {
    if (dashboardRef.current) {
      try {
        const canvas = await html2canvas(dashboardRef.current, {
          backgroundColor: "#020817",
          scale: 2, // Alta qualidade
          useCORS: true, // Permite carregar componentes externos se houver
          logging: false
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Relatorio_IA_Patricia_Oliveira.pdf");
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
      }
    }
  };

  return (
    <div ref={dashboardRef} className="min-h-screen bg-[#020817] text-white font-mono pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-10">
        
        {/* HEADER COM BOTÃO DE DOWNLOAD DIRETO */}
        <header className="bg-black border border-[#22c55e]/20 p-8 rounded-3xl shadow-2xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#22c55e] italic uppercase tracking-tighter">
              &gt; DASHBOARD_IA_INTELIGENTE
            </h1>
            <p className="text-gray-500 text-[10px] mt-1 uppercase">OPERADOR: PATRICIA OLIVEIRA</p>
          </div>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#1da34d] text-black font-black px-6 py-3 rounded-xl transition-all uppercase text-xs shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            <Download size={18} />
            Baixar PDF Agora
          </button>
        </header>

        <DashboardCurrencyCards />
        
        <div className="w-full">
          <TimelineChart />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <div key={i} className="bg-black border border-[#22c55e]/20 p-8 rounded-[2rem] shadow-2xl">
              <div className="mb-6 text-[#22c55e]">
                {p.nome.includes('Soja') ? <Leaf size={32} /> : <Fuel size={32} />}
              </div>
              <h3 className="text-white text-lg font-bold uppercase mb-4 h-12 leading-tight">{p.nome}</h3>
              <div className="pt-6 border-t border-white/5">
                <span className="text-[#22c55e] text-4xl font-black italic tracking-tighter">
                  R$ {Number(p.preco_original).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
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

      </div>
    </div>
  );
}