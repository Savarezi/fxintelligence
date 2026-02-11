import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardCurrencyCards from "@/components/DashboardCurrencyCards";
import TimelineChart from "@/components/TimelineChart";
import { useAuth } from '@/contexts/AuthContext'; 
import { 
  Fuel, Leaf, Circle, Brain, Sparkles, AlertTriangle, 
  CheckCircle, Clock, Download, Globe, Droplets, 
  Activity, Sun, Moon, User 
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MarketIntelModal } from "@/components/MarketIntelModal";

export default function Dashboard() {
  const { user } = useAuth(); 
  const [userName, setUserName] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState("");
  const [status, setStatus] = useState({ label: "ANALISANDO", color: "text-yellow-500", farol: "amarelo" });
  const [lastUpdate, setLastUpdate] = useState("");
  const [isIntelOpen, setIsIntelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      // --- BUSCA O NOME DO USUÁRIO PELO EMAIL ---
      if (user?.email) {
        try {
          const { data: userData } = await supabase
            .from('usuarios')
            .select('nome')
            .eq('email', user.email.trim()) 
            .maybeSingle();
          
          if (userData && userData.nome) {
            setUserName(userData.nome);
          } else {
            setUserName(user.user_metadata?.nome || "Operador Identificado");
          }
        } catch (err) {
          console.error("Erro ao buscar nome:", err);
        }
      }

      // --- BUSCA DE PRODUTOS ---
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
      
      // --- INSIGHT DA IA ---
      const { data: nData } = await supabase.from('noticias_b2b').select('insight_especialista').order('id', { ascending: false }).limit(1);
      if (nData && nData[0]) setAiInsight(nData[0].insight_especialista);
    }
    fetchData();
  }, [user]);

  const handleDownload = async () => {
    if (dashboardRef.current) {
      try {
        const element = dashboardRef.current;
        const canvas = await html2canvas(element, { 
          backgroundColor: isDarkMode ? "#020817" : "#F8FAFC",
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
        pdf.save(`Relatorio_FX_${userName || 'Intelligence'}.pdf`);
      } catch (error) { console.error("Erro ao gerar PDF:", error); }
    }
  };

  return (
    <div ref={dashboardRef} className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-[#020817] text-white" : "bg-slate-50 text-slate-900"} font-mono pb-20`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-10">
        
        {/* HEADER */}
        <header className={`${isDarkMode ? "bg-black border-[#22c55e]/20" : "bg-white border-slate-200"} border p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors`}>
          <div>
            <h1 className="text-3xl font-black text-[#22c55e] italic uppercase tracking-tighter">
              &gt; DASHBOARD_IA_INTELIGENTE
            </h1>
            
            <div className="mt-4 flex flex-col gap-1">
              <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} text-[10px] uppercase font-bold tracking-widest flex items-center gap-2`}>
                <Clock size={12} className="text-[#22c55e]" />
                SISTEMA ATUALIZADO EM: <span className="text-[#22c55e]">{lastUpdate || "CARREGANDO..."}</span>
              </p>
              
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1 border-t border-white/5 pt-2 md:border-t-0 md:pt-0">
                <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} text-[10px] uppercase font-bold tracking-widest flex items-center gap-2`}>
                  <User size={12} className="text-[#22c55e]" />
                  OPERADOR: <span className="text-white uppercase">{userName || "IDENTIFICANDO..."}</span>
                </p>
                <p className={`${isDarkMode ? "text-gray-500" : "text-slate-400"} text-[9px] uppercase font-bold tracking-widest`}>
                  ID_ACESSO: <span className="italic">{user?.email || "ANÔNIMO"}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${isDarkMode ? "border-white/10 text-white hover:bg-white/5" : "border-slate-200 text-slate-900 hover:bg-slate-100"}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setIsIntelOpen(true)}
              className="flex items-center gap-2 bg-transparent border-2 border-[#22c55e] hover:bg-[#22c55e]/10 text-[#22c55e] font-black px-6 py-3 rounded-xl transition-all uppercase text-[10px]"
            >
              <Activity size={18} /> Inteligência de Mercado
            </button>

            <button onClick={handleDownload} className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#1da34d] text-black font-black px-6 py-3 rounded-xl transition-all uppercase text-[10px] shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Download size={18} /> Baixar PDF
            </button>
          </div>
        </header>

        {/* PARIDADE */}
        <div className={`${isDarkMode ? "bg-black border-[#22c55e]/30" : "bg-white border-slate-200"} border p-8 rounded-2xl shadow-lg transition-colors`}>
          <div className="flex items-center gap-3 mb-4 text-[#22c55e]">
            <Globe size={24} />
            <h2 className="font-black uppercase text-lg tracking-widest">INDICADOR DE PARIDADE GLOBAL</h2>
          </div>
          <p className={`${isDarkMode ? "text-gray-200" : "text-slate-700"} text-base leading-relaxed`}>
               Os indicadores exibidos referem-se à cotação atualizada em tempo real via 
               <span className="text-[#22c55e] font-bold"> API de Alta Precisão</span>. 
               O sistema monitora a paridade das moedas 
               <span className="text-[#22c55e] font-bold text-white/90 underline decoration-[#22c55e]">USD/BRL</span> e 
               <span className="text-[#22c55e] font-bold text-white/90 underline decoration-[#22c55e]">EUR/BRL</span>.
          </p>
        </div>

        <DashboardCurrencyCards />
        <div className="w-full"><TimelineChart /></div>

        {/* PRODUTOS */}
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((p, i) => {
            const isPetroleo = p.nome.includes("Petróleo");
            return (
              <div key={i} className={`${isDarkMode ? "bg-black border-[#22c55e]/20" : "bg-white border-slate-200"} border p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between transition-colors`}>
                <div>
                  <div className="mb-6 text-[#22c55e]">
                    {p.nome.includes('Soja') ? <Leaf size={32} /> : p.nome.includes('Diesel') ? <Fuel size={32} /> : <Droplets size={32} />}
                  </div>
                  <h3 className={`${isDarkMode ? "text-white" : "text-slate-900"} text-lg font-bold uppercase mb-4 h-12 leading-tight`}>{p.nome}</h3>
                  <div className="pt-6 border-t border-white/5">
                    <span className="text-[#22c55e] text-4xl font-black italic tracking-tighter">
                      {isPetroleo ? `USD ${Number(p.preco_original).toFixed(2)}` : `R$ ${Number(p.preco_original).toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5">
                    <p className="text-[#22c55e] text-[11px] uppercase tracking-widest font-black">Fonte: {p.origem || 'Database Global'}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAROL */}
        <section className={`${isDarkMode ? "bg-black border-[#22c55e]/30" : "bg-white border-slate-200 shadow-xl"} border p-10 rounded-[2.5rem] transition-colors`}>
          <h2 className="text-center text-gray-500 text-xs font-bold uppercase mb-8 tracking-[0.3em]">Farol de Decisão Operacional</h2>
          <div className={`${isDarkMode ? "bg-gray-900/40" : "bg-slate-100"} p-10 rounded-3xl transition-colors`}>
            <div className="flex justify-around items-center">
              <Circle size={65} className={`${status.farol === "vermelho" ? "fill-red-500 text-red-500 animate-pulse shadow-[0_0_35px_rgba(239,68,68,0.5)]" : "text-gray-900 opacity-20"}`} />
              <Circle size={65} className={`${status.farol === "amarelo" ? "fill-yellow-500 text-yellow-500 animate-pulse shadow-[0_0_35px_rgba(234,179,8,0.5)]" : "text-gray-900 opacity-20"}`} />
              <Circle size={65} className={`${status.farol === "verde" ? "fill-[#22c55e] text-[#22c55e] animate-pulse shadow-[0_0_35px_rgba(34,197,94,0.5)]" : "text-gray-900 opacity-20"}`} />
            </div>
          </div>
          <p className={`mt-8 text-center text-3xl font-black italic tracking-tighter uppercase ${status.color}`}>
            {status.label}
          </p>
        </section>

        {/* INSIGHT */}
        <section className={`${isDarkMode ? "bg-black border-[#22c55e]/30" : "bg-white border-slate-200"} border p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 transition-colors`}>
          <Brain size={85} className="text-[#22c55e] animate-pulse" />
          <h2 className={`text-xl font-black italic ${isDarkMode ? "text-white" : "text-slate-900"} uppercase tracking-widest`}>Insight do Especialista</h2>
          <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 p-10 rounded-[2rem] w-full max-w-5xl shadow-inner text-center">
            <p className={`${isDarkMode ? "text-gray-200" : "text-slate-700"} text-xl italic leading-relaxed font-sans font-medium`}>
              "{aiInsight || "Aguardando análise da IA..."}"
            </p>
          </div>
        </section>

        <MarketIntelModal isOpen={isIntelOpen} onClose={() => setIsIntelOpen(false)} />

      </div>
    </div>
  );
}