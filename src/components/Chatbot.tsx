import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send } from 'lucide-react';

type Step = 'init' | 'nome' | 'idade' | 'cidade' | 'email' | 'saved' | 'currency' | 'result' | 'end';

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
  const [data, setData] = useState({ nome: '', idade: '', cidade_pais: '', email: '' });
  const [ended, setEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    if (!open && messages.length === 0) {
      // Initial message
      setTimeout(() => {
        addBot('Olá! Eu sou um assistente virtual limitado exclusivamente a consultas de Dólar e Euro. No momento, não realizo outras integrações ou tipos de consulta.');
        setTimeout(() => {
          addBot('Qual é o seu nome?');
          setStep('nome');
        }, 800);
      }, 300);
    }
    setOpen(true);
  };

  const handleSend = async () => {
    if (!input.trim() || ended) return;
    const value = input.trim();
    setInput('');
    addUser(value);

    switch (step) {
      case 'nome':
        setData((d) => ({ ...d, nome: value }));
        setTimeout(() => { addBot('Qual é a sua idade?'); setStep('idade'); }, 400);
        break;
      case 'idade':
        setData((d) => ({ ...d, idade: value }));
        setTimeout(() => { addBot('Qual é a sua cidade / país?'); setStep('cidade'); }, 400);
        break;
      case 'cidade':
        setData((d) => ({ ...d, cidade_pais: value }));
        setTimeout(() => { addBot('Qual é o seu e-mail?'); setStep('email'); }, 400);
        break;
      case 'email':
        const updatedData = { ...data, email: value };
        setData(updatedData);
        // Save to leads_chatbot
        await supabase.from('leads_chatbot').insert({
          nome: updatedData.nome,
          idade: updatedData.idade,
          cidade_pais: updatedData.cidade_pais,
          email: updatedData.email,
        });
        setTimeout(() => {
          addBot(`Obrigado, ${updatedData.nome}. Seus dados foram registrados.`);
          setTimeout(() => {
            addBot(`Agora, ${updatedData.nome}, você quer saber o valor do Dólar ou do Euro?`, [
              { label: 'Dólar', value: 'USD' },
              { label: 'Euro', value: 'EUR' },
            ]);
            setStep('currency');
          }, 800);
        }, 400);
        break;
      default:
        break;
    }
  };

  const handleCurrencyChoice = async (currency: string) => {
    addUser(currency === 'USD' ? 'Dólar' : 'Euro');
    setStep('result');

    const { data: moedaData } = await supabase
      .from('moedas')
      .select('valor_compra, valor_venda')
      .eq('sigla', currency)
      .limit(1);

    const moeda = moedaData?.[0] as { valor_compra: number | null; valor_venda: number | null } | undefined;
    const currencyName = currency === 'USD' ? 'Dólar' : 'Euro';

    setTimeout(() => {
      if (moeda) {
        addBot(
          `${data.nome}, o valor atual do ${currencyName}:\n\n💰 Compra: R$ ${moeda.valor_compra?.toFixed(4) ?? '—'}\n💰 Venda: R$ ${moeda.valor_venda?.toFixed(4) ?? '—'}`
        );
      } else {
        addBot(`${data.nome}, não encontrei dados do ${currencyName} no momento.`);
      }
      setTimeout(() => {
        addBot('Para acompanhar mais dados, gráficos e análises completas, acesse o nosso Dashboard.', [
          { label: 'Ir para o Dashboard', value: 'dashboard' },
        ]);
        setStep('end');
      }, 1000);
    }, 600);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Float button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 glow-green-strong"
          aria-label="Abrir chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
              <span className="text-sm font-semibold">FX Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  {msg.text}
                  {msg.buttons && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.buttons.map((btn) => (
                        <button
                          key={btn.value}
                          onClick={() => {
                            if (btn.value === 'dashboard') {
                              handleDashboard();
                            } else {
                              handleCurrencyChoice(btn.value);
                            }
                          }}
                          className="rounded-lg border border-primary bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
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

          {/* Input */}
          {step !== 'end' && step !== 'currency' && step !== 'result' && step !== 'init' && (
            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua resposta..."
                  className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
                <button
                  onClick={handleSend}
                  className="rounded-lg bg-primary p-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
