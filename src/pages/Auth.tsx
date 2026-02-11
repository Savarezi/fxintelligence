import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Eye, EyeOff, Zap, ShieldCheck, Cpu, Database } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Força a limpeza dos campos ao montar o componente para evitar persistência do navegador
  useEffect(() => {
    setEmail('');
    setPassword('');
    setNome('');
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const agora = new Date().toISOString();

    try {
      if (isLogin) {
        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) throw loginErr;

        await supabase.from('usuarios').update({ ultimo_acesso: agora }).eq('email', email);
        navigate('/dashboard');
      } else {
        const { data: authData } = await signUp(email, password, nome);
        
        await supabase.from('usuarios').insert([
          {
            nome: nome,
            email: email,
            senha: password,
            status_conta: 'Ativo',
            data_cadastro: agora,
            ultimo_acesso: agora
          }
        ]);

        await supabase.from('logs_consultas_usuario').insert([
          {
            moeda: 'CADASTRO NOVO',
            data_consulta: agora
          }
        ]);

        setSuccess('Cadastro e Log registrados!');
        setNome('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020817] font-sans selection:bg-[#00ff88]/30">
      
      {/* LADO ESQUERDO: APRESENTAÇÃO TECNOLÓGICA */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center px-16 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-6">
            <Zap className="w-3 h-3 text-[#00ff88] animate-pulse" />
            <span className="text-[10px] font-bold text-[#00ff88] uppercase tracking-[0.2em]">Sistemas Ativos</span>
          </div>

          <h1 className="text-5xl font-black text-white leading-tight mb-8">
            Inteligência Cambial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-emerald-500">
              em Tempo Real
            </span>
          </h1>

          <div className="space-y-8 max-w-lg">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 h-fit text-[#00ff88]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                O Dashboard entrega uma visão unificada e em tempo real do mercado, combinando <span className="text-white font-bold">dados, automação e inteligência artificial</span> em um único ambiente.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 h-fit text-[#00ff88]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                Apresenta paridade global atualizada, tendências de ativos, sinais visuais de decisão e <span className="text-white font-bold">relatórios automáticos em PDF</span> com um clique.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 h-fit text-[#00ff88]">
                <Cpu className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 italic">
                Arquitetura integrada: <span className="text-[#00ff88]">Supabase</span> para dados, <span className="text-[#00ff88]">n8n</span> para automações e <span className="text-[#00ff88]">IA</span> para transformar informação em decisão estratégica.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: LOGIN / CADASTRO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00ff88]/10 rounded-full blur-[120px]" />

        <div className="w-full max-w-md relative">
          <div className="rounded-[2.5rem] border border-white/10 bg-[#0c0c0e]/80 backdrop-blur-3xl p-10 shadow-3xl">
            <div className="mb-10 text-center">
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-[#00ff88]/20 to-emerald-500/5 border border-[#00ff88]/20 mb-4">
                <BarChart3 className="h-8 w-8 text-[#00ff88]" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">FX Intelligence</h2>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Portal de Acesso Interno</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="DIGITE SEU NOME"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white placeholder:text-gray-700 focus:border-[#00ff88]/50 outline-none transition-all font-mono"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Credencial de E-mail</label>
                <input
                  type="email"
                  placeholder="NOME@EMPRESA.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="one-time-code"
                  className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white placeholder:text-gray-700 focus:border-[#00ff88]/50 outline-none transition-all font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Chave de Acesso</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/5 bg-white/5 p-4 text-white placeholder:text-gray-700 focus:border-[#00ff88]/50 outline-none transition-all font-mono"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#00ff88] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  <p className="text-[10px] font-bold text-red-500 uppercase text-center">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-[#00ff88]/10 border border-[#00ff88]/20 p-3 rounded-lg">
                  <p className="text-[10px] font-bold text-[#00ff88] uppercase text-center">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-[#00ff88] py-4 font-black text-black uppercase tracking-widest transition-all hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] active:scale-[0.98] disabled:opacity-50"
              >
                <span className="relative z-10">
                  {loading ? 'PROCESSANDO...' : isLogin ? 'ENTRAR NO DASHBOARD' : 'CONFIRMAR CADASTRO'}
                </span>
              </button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-8 w-full text-center text-[10px] font-black text-gray-600 hover:text-[#00ff88] uppercase tracking-[0.2em] transition-colors"
            >
              {isLogin ? 'Não possui acesso? Solicite aqui' : 'Já possui credenciais? Voltar'}
            </button>
          </div>
          
          <p className="text-center mt-8 text-[9px] text-gray-700 uppercase tracking-widest font-bold">
            Security Powered by FX Intelligence Protocol v2.0
          </p>
        </div>
      </div>
    </div>
  );
}