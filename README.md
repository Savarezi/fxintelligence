# 💱 FX Intelligence — Sistema Inteligente de Monitoramento de Câmbio

O **FX Intelligence** é um sistema web inteligente voltado à **análise e monitoramento de taxas de câmbio**, com foco em **importação, exportação e tomada de decisão estratégica B2B**.

A plataforma transforma dados financeiros brutos em **insights acionáveis**, combinando automação, análise histórica, inteligência artificial e visualização estratégica.

![Logo](./Captura%20de%20tela%202026-02-07%20200230.png)

---

## 🚀 Proposta de Valor

Empresas que operam no comércio internacional precisam decidir **quando comprar, vender ou importar**.

O FX Intelligence entrega:

- 📊 Monitoramento automático de **Dólar (USD) e Euro (EUR)**
- 📈 Análise de **tendências cambiais**
- 🔁 Comparação entre **períodos históricos**
- 🤖 Insights estratégicos gerados por IA
- ⚙️ Automações contínuas com **n8n**
- 🧠 Contexto de mercado via notícias econômicas, commodities e logística

Sem achismo. Só dado, contexto e decisão.

---

## 🧠 Foco do Produto

- Monitoramento cambial inteligente  
- Análise histórica e comparativa  
- Identificação de padrões e tendências  
- Suporte estratégico à decisão em importação e exportação  

Aplicável para:

- Compras internacionais  
- Logística  
- Agronegócio  
- Planejamento financeiro  
- Operações B2B  

---

## 🏗️ Arquitetura Geral

Pipeline automatizado de ponta a ponta:

1. Coleta automática de cotações via API pública  
2. Sincronização de preços globais  
3. Monitoramento de commodities estratégicas  
4. Processamento e análise com JavaScript  
5. Orquestração de fluxos com n8n  
6. Persistência relacional no Supabase  
7. Visualização estratégica via dashboard  
8. Geração de insights com IA (FX Intelligence Engine)  

---

## 🔄 Arquitetura de Workflow (n8n)

O n8n é responsável por orquestrar toda a inteligência operacional do sistema.
<img width="530" height="142" alt="image" src="https://github.com/user-attachments/assets/d6fc88e5-4a26-40fe-a1f9-0962dabc591b" />


### 🔹 Fluxos Automatizados

### 1️⃣ Cotação Cambial
<img width="768" height="259" alt="image" src="https://github.com/user-attachments/assets/d0601832-7314-4162-a57e-84b7546ac677" />

- Schedule Trigger periódico  
- Coleta via ExchangeRate API  
- Armazenamento em `cotacoes`  
- Atualização de `historico_cambio`

###

### 2️⃣ Sincronização de Preços Globais
<img width="317" height="265" alt="image" src="https://github.com/user-attachments/assets/2d697a13-7da7-4f29-9eef-b6cf56d99923" />

- Benchmark internacional (EUA × Brasil)  
- Conversão automática pela taxa atual  
- Identificação de oportunidades de importação

###

### 3️⃣ Monitoramento de Commodities
<img width="530" height="236" alt="image" src="https://github.com/user-attachments/assets/99122557-5faf-4c75-96eb-7f16a65a6492" />

- Soja  
- Petróleo Brent  
- WTI  
- Indicadores energéticos  

Coleta via **SerpApi** e fontes estratégicas.

Esses dados alimentam o núcleo analítico:

> 🧠 FX Intelligence Engine  
> Camada que cruza câmbio + commodities + contexto econômico.

---

## 🤖 Camada de Inteligência Artificial

### Modelo
- Groq Chat Model  

### Funções
- Resumir notícias econômicas  
- Interpretar impacto comercial  
- Correlacionar eventos globais com variações cambiais  
- Gerar insights estratégicos para decisão B2B  

### Memória Contextual
- Mantém coerência entre análises  
- Evita redundância  
- Identifica continuidade macroeconômica  

### Ferramentas Integradas
- Wikipedia (validação histórica)  
- Date & Time (correlação temporal)  
- Base de dados interna (Supabase)  

---

## 📊 Interface do Sistema

### 🔐 Tela de Login

<img width="894" height="436" alt="image" src="https://github.com/user-attachments/assets/7f45f7ed-a4ec-458f-94e1-9395e4c84947" />

- Autenticação via Supabase Auth  
- Controle de acesso ao dashboard  
- Estrutura preparada para RBAC  

---

### 📈 Dashboard Estratégico


O dashboard apresenta:

- Histórico de Dólar e Euro  
- Gráficos comparativos por período  
- Insights gerados pela IA  
- Feed de notícias contextualizadas  
- Indicadores de commodities  
- Conversor integrado  

---

### 💱 Conversor Cambial (Front-End)

<img width="730" height="431" alt="image" src="https://github.com/user-attachments/assets/4132cdf3-9d36-43ca-86d7-b47f2189c9a9" />

Funcionalidades:

- Conversão em tempo real  
- Atualização automática conforme cotação  
- Interface objetiva e responsiva  
- Aplicação prática para tomada rápida de decisão  

---

## 📊 Casos de Uso Estratégicos

### 1️⃣ Benchmark Tecnológico
- Comparação Amazon EUA × Brasil  
- Apoio à decisão de renovação de ativos de TI  

### 2️⃣ Agronegócio
- Commodity-chave: Soja  
- Correlação com variação cambial  
- Previsibilidade financeira para contratos B2B  

### 3️⃣ Logística e Energia
- Monitoramento de Brent / WTI  
- Impacto direto em frete e margem operacional  

### 4️⃣ Inteligência de Conteúdo
- Feed automatizado de notícias  
- Remoção de dados com mais de 5 dias  
- Foco em eventos de alto impacto econômico  

---

## 🗂️ Estrutura do Projeto

### 📁 Pastas

| Pasta | Descrição |
|-------|----------|
| [`public/`](./public) | Arquivos públicos e estáticos |
| [`src/`](./src) | Código-fonte da aplicação |
| [`supabase/`](./supabase) | Configurações, migrations e integrações com Supabase |

---

### 📄 Arquivos Importantes

| Arquivo | Função |
|----------|--------|
| [`index.html`](./index.html) | Entrada principal da aplicação |
| [`vite.config.ts`](./vite.config.ts) | Configuração do Vite |
| [`tailwind.config.ts`](./tailwind.config.ts) | Design system |
| [`eslint.config.js`](./eslint.config.js) | Padronização de código |
| [`package.json`](./package.json) | Dependências e scripts |
| [`.env`](./.env) | Variáveis de ambiente |
| [`README.md`](./README.md) | Documentação do projeto |
---

## 🧪 Tecnologias Utilizadas

- Frontend: Vite + TypeScript  
- Estilização: Tailwind CSS  
- Backend / DB: Supabase (PostgreSQL)  
- Automação: n8n  
- IA: Groq Chat Model  
- APIs:
  - ExchangeRate API  
  - SerpApi  

---

## 📑 Documentação

📌 Slides  
https://www.canva.com/design/DAHAetjUlco/0A2lJH8EKAH-LRRW3heRgQ/view  

📌 Documentação Técnica  
https://www.notion.so/Doc-Inicial-DiverseDev-2026-2fc1ccb20a76803fa0d6c373cbfd7f58  

---

## ✅ Status do Projeto

- ✔️ Arquitetura definida  
- ✔️ Workflows n8n implementados  
- ✔️ Integração com Supabase concluída  
- ✔️ IA operacional  
- ✔️ Interface funcional  
- ✔️ Estrutura pronta para evolução e escala  

---

## 🏁 Considerações Finais

O **FX Intelligence** não é apenas um monitor de câmbio.

É uma plataforma de inteligência estratégica projetada para transformar volatilidade em vantagem competitiva.

Câmbio oscila.  
Commodities variam.  
Mercado reage.  

Quem tem contexto decide antes.
