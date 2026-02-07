import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Eye, EyeOff } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const agora = new Date().toISOString();

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
        if (loginErr) throw loginErr;

        await supabase.from('usuarios').update({ ultimo_acesso: agora }).eq('email', email);
        navigate('/dashboard');
      } else {
        // --- CADASTRO ---
        // 1. Cria no Auth do Supabase
        const { data: authData } = await signUp(email, password, nome);
        
        // 2. SALVA NA TABELA USUARIOS (O que já estava funcionando)
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

        // 3. SALVA NA TABELA DE LOGS (Independente e sem travas)
        // Aqui enviamos apenas o e-mail ou nome se o ID estiver difícil, 
        // mas vamos tentar mandar o e-mail no lugar do user_id se sua tabela permitir,
        // ou apenas os textos fixos.
        await supabase.from('logs_consultas_usuario').insert([
          {
            moeda: 'CADASTRO NOVO', // Texto fixo para registro
            data_consulta: agora
            // Removi o user_id para não dar erro de relação/FK
          }
        ]);

        // LIMPEZA DOS CAMPOS
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
    <div className="flex min-h-screen items-center justify-center bg-[#020817] p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0e] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-[#22c55e]" />
          <h1 className="mt-4 text-2xl font-black text-white uppercase tracking-tighter">FX Intelligence</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="NOME"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[#22c55e] outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[#22c55e] outline-none"
            required
          />
          <input
            type="password"
            placeholder="SENHA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white focus:border-[#22c55e] outline-none"
            required
          />

          {error && <div className="text-[10px] font-bold text-red-500 uppercase">{error}</div>}
          {success && <div className="text-[10px] font-bold text-[#22c55e] uppercase">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#22c55e] py-3 font-black text-black hover:bg-[#1ca850]"
          >
            {loading ? 'CARREGANDO...' : isLogin ? 'ENTRAR' : 'CADASTRAR E SALVAR'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-center text-xs font-bold text-gray-500 hover:text-[#22c55e] uppercase"
        >
          {isLogin ? 'Criar Conta' : 'Voltar ao Login'}
        </button>
      </div>
    </div>
  );
}