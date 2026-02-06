
-- Tabela de moedas (valores atuais)
CREATE TABLE public.moedas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sigla TEXT NOT NULL,
  valor_compra NUMERIC,
  valor_venda NUMERIC,
  variacao NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de histórico de câmbio
CREATE TABLE public.historico_cambio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moeda TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de insights de câmbio (semáforo de importação)
CREATE TABLE public.insights_cambio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moeda TEXT,
  status TEXT NOT NULL,
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de notícias B2B
CREATE TABLE public.noticias_b2b (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  fonte TEXT,
  setor TEXT,
  publicado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  url_imagem TEXT,
  url_noticia TEXT,
  insight_especialista TEXT
);

-- Tabela de produtos globais
CREATE TABLE public.produtos_globais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  valor NUMERIC,
  unidade TEXT,
  variacao NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de leads do chatbot
CREATE TABLE public.leads_chatbot (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  idade TEXT,
  cidade_pais TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de usuários (perfil vinculado ao auth)
CREATE TABLE public.usuarios (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ultimo_acesso TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status_conta TEXT NOT NULL DEFAULT 'ativo'
);

-- Tabela de logs de consultas do usuário
CREATE TABLE public.logs_consultas_usuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moeda TEXT NOT NULL,
  data_consulta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de logs do sistema
CREATE TABLE public.logs_sistema (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT,
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.moedas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_cambio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights_cambio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias_b2b ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_globais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_chatbot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_consultas_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_sistema ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read moedas" ON public.moedas FOR SELECT USING (true);
CREATE POLICY "Public read historico_cambio" ON public.historico_cambio FOR SELECT USING (true);
CREATE POLICY "Public read insights_cambio" ON public.insights_cambio FOR SELECT USING (true);
CREATE POLICY "Public read noticias_b2b" ON public.noticias_b2b FOR SELECT USING (true);
CREATE POLICY "Public read produtos_globais" ON public.produtos_globais FOR SELECT USING (true);
CREATE POLICY "Public read logs_sistema" ON public.logs_sistema FOR SELECT USING (true);

-- Leads chatbot: anyone can insert
CREATE POLICY "Public insert leads_chatbot" ON public.leads_chatbot FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated read leads_chatbot" ON public.leads_chatbot FOR SELECT USING (auth.role() = 'authenticated');

-- Usuarios: users manage their own profile
CREATE POLICY "Users read own profile" ON public.usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.usuarios FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.usuarios FOR INSERT WITH CHECK (auth.uid() = id);

-- Logs consultas: anyone can insert, authenticated read own
CREATE POLICY "Public insert logs_consultas" ON public.logs_consultas_usuario FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own logs" ON public.logs_consultas_usuario FOR SELECT USING (auth.uid() = user_id);

-- Trigger to create usuario profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome, created_at, data_cadastro, ultimo_acesso, status_conta)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    now(),
    now(),
    now(),
    'ativo'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update ultimo_acesso on login
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.usuarios
  SET ultimo_acesso = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
