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

  const handleClose = () => {
    setOpen(false);
    setMessages([]);
    setStep('init');
    setData({ nome: '', idade: '', city_pais: '', email: '' });
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
    if (messages.length === 0) {
      setTimeout(() => {
        addBot('Olá! Sou o Assistente da FX Intelligence. Estou aqui para te informar as cotações oficiais em tempo real.');
        setTimeout(() => {
          addBot('Para começar, como posso te chamar?');
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
      setTimeout(() => { addBot('Qual o seu melhor e-mail para liberar a consulta?'); setStep('email'); }, 600);
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
        addBot(`Obrigado, ${finalData.nome}! Qual moeda deseja consultar hoje?`, [
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
        addBot('Não localizei os dados. Por favor, tente novamente em instantes.');
      }

      setTimeout(() => {
        addBot('Deseja ver análises completas? Assine nossa plataforma!', [
          { label: 'Ver Planos', value: 'plans' }
        ]);
        setStep('end');
      }, 1000);
    }, 600);
  };

  return (
    <>
      {!open && (
        <button onClick={handleOpen} className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#22c55e] flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform">
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl">
          <div className="flex items-center justify-between bg-white/5 px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">FX Assistant</span>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' ? 'bg-[#22c55e] text-black font-bold' : 'bg-white/5 text-gray-300'
                }`}>
                  {msg.text}
                  {msg.buttons && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.buttons.map((btn) => (
                        <button key={btn.value} onClick={() => handleCurrencyChoice(btn.value)} className="rounded-lg border border-[#22c55e] bg-[#22c55e]/10 px-3 py-1 text-xs font-bold text-[#22c55e] hover:bg-[#22c55e] hover:text-black">
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
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Escreva aqui..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#22c55e]/50" />
              <button onClick={handleSend} className="bg-[#22c55e] text-black p-2 rounded-xl"><Send size={18} /></button>
            </div>
          )}
        </div>
      )}
    </>
  );
}