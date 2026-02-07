import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, X, Send } from 'lucide-react';

type Step = 'init' | 'nome' | 'idade' | 'cidade' | 'email' | 'currency' | 'end';

interface Message {
  role: 'bot' | 'user';
  text: string;
  buttons?: { label: string; value: string }[];
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('init');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [data, setData] = useState({ nome: '', idade: '', city_pais: '', email: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- FUNÇÃO PARA RESETAR TUDO ---
  const handleClose = () => {
    setOpen(false);
    setMessages([]); // Limpa as mensagens
    setStep('init'); // Volta ao passo inicial
    setData({ nome: '', idade: '', city_pais: '', email: '' }); // Limpa os dados guardados
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const addBot = (text: string, buttons?: { label: string; value: string }[]) => {
    setMessages((prev) => [...prev, { role: 'bot', text, buttons }]);
  };

  const addUser = (text: string) => {
    setMessages((prev) => [...prev, { role: 'user', text }]);
  };

  const handleOpen = () => {
    setOpen(true);
    // Removemos a trava messages.length === 0 para ele sempre iniciar se estiver vazio
    if (messages.length === 0) {
      setTimeout(() => {
        addBot('Olá! Sou o Assistente de Inteligência Cambial da FX Intelligence. Sou um sistema especializado e limitado exclusivamente à consulta das cotações de Dólar e Euro em tempo real. Não realizo outras tarefas ou integrações fora deste escopo.');
        
        setTimeout(() => {
          addBot('Para aceder ao valor atualizado agora, como posso te chamar?');
          setStep('nome');
        }, 1200);
      }, 300);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const value = input.trim();
    setInput('');
    addUser(value);

    if (step === 'nome') {
      setData((d) => ({ ...d, nome: value }));
      setTimeout(() => { addBot(`Prazer, ${value}! Qual é a sua idade?`); setStep('idade'); }, 600);
    } 
    else if (step === 'idade') {
      setData((d) => ({ ...d, idade: value }));
      setTimeout(() => { addBot('E de qual cidade e país você fala?'); setStep('cidade'); }, 600);
    } 
    else if (step === 'cidade') {
      setData((d) => ({ ...d, city_pais: value }));
      setTimeout(() => { addBot('Para liberar sua consulta, qual o seu melhor e-mail?'); setStep('email'); }, 600);
    } 
    else if (step === 'email') {
      const finalData = { ...data, email: value };
      setData(finalData);

      await supabase.from('leads_chatbot').insert({
        nome: finalData.nome,
        idade: finalData.idade,
        cidade_pais: finalData.city_pais,
        email: finalData.email
      });

      setTimeout(() => {
        addBot(`Obrigado, ${finalData.nome}! Dados registrados. Agora, qual moeda você deseja consultar?`, [
          { label: 'Dólar (USD)', value: 'BRL' }, 
          { label: 'Euro (EUR)', value: 'EUR' },
        ]);
        setStep('currency');
      }, 600);
    }
  };

  const handleCurrencyChoice = async (moedaDestino: string) => {
    addUser(moedaDestino === 'BRL' ? 'Dólar' : 'Euro');

    const { data: cambio } = await supabase
      .from('historico_cambio')
      .select('valor_cambio')
      .eq('moeda_destino', moedaDestino)
      .order('data_consulta', { ascending: false })
      .limit(1)
      .single();

    setTimeout(() => {
      if (cambio) {
        addBot(`${data.nome}, o valor atual do ${moedaDestino === 'BRL' ? 'Dólar' : 'Euro'} é R$ ${cambio.valor_cambio.toFixed(2)}.`);
      } else {
        addBot('Não consegui localizar os dados de cotação agora. Por favor, tente o Dashboard.');
      }

      setTimeout(() => {
        addBot('Para ter acesso a gráficos e análises completas, assine nossa plataforma!', [
          { label: 'Ver Planos', value: 'plans' }
        ]);
        setStep('end');
      }, 1000);
    }, 600);
  };

  return (
    <>
      {!open && (
        <button onClick={handleOpen} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-black shadow-lg hover:scale-110 transition-transform">
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl">
          <div className="flex items-center justify-between bg-white/5 px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">FX Assistant</span>
            </div>
            {/* CHAMANDO O RESET AO FECHAR */}
            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#22c55e] text-black font-bold' 
                  : 'bg-white/5 text-gray-300 border border-white/5'
                }`}>
                  {msg.text}
                  {msg.buttons && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.buttons.map((btn) => (
                        <button 
                          key={btn.value} 
                          onClick={() => handleCurrencyChoice(btn.value)}
                          className="rounded-lg border border-[#22c55e] bg-[#22c55e]/10 px-3 py-1 text-xs font-bold text-[#22c55e] hover:bg-[#22c55e] hover:text-black transition-all"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {(step !== 'currency' && step !== 'end') && (
            <div className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escreva aqui..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]/50"
              />
              <button onClick={handleSend} className="bg-[#22c55e] text-black p-2 rounded-xl hover:scale-105 transition-transform">
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}