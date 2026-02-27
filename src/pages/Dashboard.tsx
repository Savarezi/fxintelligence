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

      const { data: pData } = await supabase
        .from('produtos_globais')
        .select('*')
        .order('id', { ascending: false });
      
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
          if (preco < 5.80)
            setStatus({ label: "COMPRA_RECOMENDADA", color: "text-[#22c55e]", farol: "verde" });
          else if (preco >= 5.80 && preco <= 6.30)
            setStatus({ label: "AGUARDAR_MERCADO", color: "text-yellow-500", farol: "amarelo" });
          else
            setStatus({ label: "VENDA_ESTRATEGICA", color: "text-red-500", farol: "vermelho" });
        }
      }
      
      const { data: nData } = await supabase
        .from('noticias_b2b')
        .select('insight_especialista')
        .order('id', { ascending: false })
        .limit(1);

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
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
      }
    }
  };

  return (
    <div ref={dashboardRef} className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-[#020817] text-white" : "bg-slate-50 text-slate-900"} font-mono pb-20`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 space-y-10">

        <DashboardCurrencyCards />
        <TimelineChart />

        {/* FAROL */}
        <section className={`${isDarkMode ? "bg-black border-[#22c55e]/30" : "bg-white border-slate-200 shadow-xl"} border p-10 rounded-[2.5rem] transition-colors`}>
          <h2 className="text-center text-gray-500 text-xs font-bold uppercase mb-8 tracking-[0.3em]">
            Farol de Decisão Operacional
          </h2>

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

          {/* EXPLICAÇÃO DAS CORES */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-sm">
            <div className="border border-red-500/30 bg-red-500/5 p-6 rounded-2xl">
              <h3 className="text-red-500 font-bold mb-2 uppercase">🔴 Vermelho</h3>
              <p className="text-gray-400 leading-relaxed">
                Indica preço elevado acima da faixa estratégica.
                Momento favorável para venda ou redução de exposição.
              </p>
            </div>

            <div className="border border-yellow-500/30 bg-yellow-500/5 p-6 rounded-2xl">
              <h3 className="text-yellow-500 font-bold mb-2 uppercase">🟡 Amarelo</h3>
              <p className="text-gray-400 leading-relaxed">
                Zona de atenção e monitoramento.
                Mercado em consolidação ou indefinição.
              </p>
            </div>

            <div className="border border-[#22c55e]/30 bg-[#22c55e]/5 p-6 rounded-2xl">
              <h3 className="text-[#22c55e] font-bold mb-2 uppercase">🟢 Verde</h3>
              <p className="text-gray-400 leading-relaxed">
                Preço abaixo da média estratégica.
                Indica oportunidade de compra.
              </p>
            </div>
          </div>
        </section>

        {/* INSIGHT */}
        <section className={`${isDarkMode ? "bg-black border-[#22c55e]/30" : "bg-white border-slate-200"} border p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 transition-colors`}>
          <Brain size={85} className="text-[#22c55e] animate-pulse" />

          <h2 className={`text-xl font-black italic ${isDarkMode ? "text-white" : "text-slate-900"} uppercase tracking-widest`}>
            Insight do Especialista
          </h2>

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