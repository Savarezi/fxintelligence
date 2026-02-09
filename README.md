# 💱 FX Intelligence — Sistema Inteligente de Monitoramento de Câmbio

O **FX Intelligence** é um sistema web inteligente voltado à **análise e monitoramento de taxas de câmbio**, com foco em **importação, exportação e tomada de decisão estratégica B2B**.  
A plataforma transforma dados financeiros brutos em **insights acionáveis**, combinando automação, análise histórica, inteligência artificial e visualização clara.
![Logo](<Captura de tela 2026-02-07 200230.png>)
---

## 🚀 Proposta de Valor

Empresas que operam no comércio internacional precisam decidir **quando comprar, vender ou importar**.  
O FX Intelligence entrega exatamente isso:

- 📊 Monitoramento automático de **Dólar e Euro**
- 📈 Análise de **tendências cambiais**
- 🔁 Comparação entre **períodos históricos**
- 🤖 Insights estratégicos gerados por **IA**
- ⚙️ Automações contínuas com **n8n**
- 🧠 Contexto de mercado via **notícias econômicas e logísticas**

Sem achismo. Só dado, contexto e decisão.

---

## 🧠 Foco do Produto

O sistema é focado em:

- **Monitoramento cambial inteligente**
- **Análise histórica e comparativa**
- **Identificação de padrões e tendências**
- **Suporte à tomada de decisão em importação e exportação**

Especialmente relevante para:
- Compras internacionais  
- Logística  
- Agronegócio  
- Planejamento financeiro  
- B2B e comércio exterior  

---

## 🏗️ Arquitetura Geral

O FX Intelligence opera em um pipeline automatizado de ponta a ponta:

1. **Coleta automática** de cotações via API pública
2. **Processamento e análise** com JavaScript
3. **Automação de fluxos** com n8n
4. **Persistência relacional** no Supabase
5. **Visualização e insights** via dashboard web
6. **Contextualização de dados** com notícias e IA

---

## 🔄 Arquitetura de Workflow (n8n)

O n8n é responsável por orquestrar toda a inteligência do sistema:
![Estrutura do projeto](<./Captura%20de%20tela%202026-02-08%20193120.png>)


- **Schedule Trigger**  
  Executa coletas de forma periódica e assíncrona.

- **Extração de Dados**
  - API de câmbio (ExchangeRate API)
  - SerpApi (notícias, commodities e logística)

- **Enriquecimento com IA**
  - AI Agent + **Groq Chat Model**
  - Análise do impacto comercial das oscilações

- **Persistência**
  - Banco relacional no **Supabase**
  - Tabelas como `cotacoes`, `historico_cambio`, `noticias_b2b`

---

## 🤖 Camada de Inteligência Artificial

O sistema conta com um **Agente Cognitivo de IA**, atuando como um analista virtual:

- **Modelo:** Groq Chat Model  
- **Função:**  
  - Resumir notícias  
  - Interpretar impactos econômicos  
  - Relacionar eventos com variações cambiais  

- **Memória:**  
  - Manutenção de contexto entre análises
  - Evita redundância e ruído informacional

- **Ferramentas Integradas:**  
  - Wikipedia (validação histórica)
  - Date & Time (correlação temporal)

---

## 📊 Casos de Uso Estratégicos

### 1️⃣ Monitoramento de Eletrônicos (Benchmark Tecnológico)

- **Comparação:** Amazon EUA × Brasil   
- **Valor:** Apoia decisões de renovação de ativos de TI  

---

### 2️⃣ Monitoramento de Commodities (Agronegócio)

- **Commodity-chave:** S
- **Impacto:**  
- **Execução Técnica:**  
  - Dados coletados via **SerpApi**
  - Previsibilidade financeira para contratos B2B  

---

### 3️⃣ Monitoramento de Energia (Logística)

- **Indicadores:** Petróleo Brent / WTI  
- **Impacto direto:**  
  - Custo de frete  
  - Transporte  
  - Margem de lucro logística  

Essencial para operações B2B com dependência de transporte.

---

### 4️⃣ Inteligência de Conteúdo (Contexto de Mercado)

- **Feed de Notícias Inteligente**
- **Curadoria Automática**
  - Remoção de dados com mais de 5 dias
  - Foco total na relevância atual  

- **Diferencial Competitivo:**  
  Dados + contexto = reação rápida a crises e oportunidades.

---

## 🗂️ Estrutura do Projeto

### 📁 Pastas Principais

| Pasta | Descrição |
|------|----------|
| [`public/`](./public) | Arquivos públicos e estáticos |
| [`src/`](./src) | Código-fonte da aplicação web |
| [`supabase/`](./supabase) | Configurações, migrations e integrações com Supabase |

---
### 📄 Arquivos Importantes

| Arquivo | Função |
|-------|-------|
| [`index.html`](./index.html) | Entrada principal da aplicação |
| [`vite.config.ts`](./vite.config.ts) | Configuração do Vite |
| [`tailwind.config.ts`](./tailwind.config.ts) | Tema e design system |
| [`eslint.config.js`](./eslint.config.js) | Padronização de código |
| [`package.json`](./package.json) | Dependências e scripts |
| [`.env`](./.env) | Variáveis de ambiente |
| [`README.md`](./README.md) | Documentação do projeto |

---

---

## 🧪 Tecnologias Utilizadas

- **Frontend:** Vite + JavaScript / TypeScript  
- **Estilização:** Tailwind CSS  
- **Backend / DB:** Supabase (PostgreSQL)  
- **Automação:** n8n  
- **IA:** Groq Chat Model  
- **APIs:**  
  - ExchangeRate API  
  - SerpApi  

---

## 📑 Documentação e Apresentação

📌 **Documentação e Apresentação**
👉 Slides disponíveis no [Canva](https://www.canva.com/design/DAHAetjUlco/0A2lJH8EKAH-LRRW3heRgQ/view?utm_content=DAHAetjUlco&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1f9983664f)  
👉 Documentação completa no [Notion](https://www.notion.so/Doc-Inicial-DiverseDev-2026-2fc1ccb20a76803fa0d6c373cbfd7f58?source=copy_link)

---

## ✅ Status do Projeto

- ✔️ Arquitetura definida  
- ✔️ Automação implementada  
- ✔️ Persistência configurada  
- ✔️ IA integrada  
- ✔️ Pronto para evolução e escala  

---

## 🏁 Considerações Finais

O **FX Intelligence** não é apenas um monitor de câmbio.  
É uma **plataforma de inteligência estratégica**, construída para transformar volatilidade em vantagem competitiva.

Dados passam.  
Insight fica.  
Decisão certa paga o projeto inteiro.





