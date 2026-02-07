import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Box, Fuel, Factory } from 'lucide-react';

export default function ProductCards() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // 1. Trazemos todos os produtos globais sem filtros complicados
      const { data, error } = await supabase
        .from('produtos_globais')
        .select('nome, setor, preco_original, moeda_origem, link_produto')
        .order('criado_em', { ascending: false });

      if (data) {
        // 2. Filtramos manualmente aqui para garantir que encontramos os 3
        // Procuramos por qualquer nome que contenha a palavra chave
        const soja = data.find(p => p.nome.toLowerCase().includes('soja'));
        const diesel = data.find(p => p.nome.toLowerCase().includes('diesel'));
        const petroleo = data.find(p => p.nome.toLowerCase().includes('petróleo') || p.nome.toLowerCase().includes('petroleo'));

        const listaFinal = [];
        if (soja) listaFinal.push(soja);
        if (diesel) listaFinal.push(diesel);
        if (petroleo) listaFinal.push(petroleo);

        setProducts(listaFinal);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500 uppercase font-bold animate-pulse tracking-widest">Sincronizando Commodities...</div>;

  // Função de ícones baseada no que contém no nome
  const getIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes('petróleo') || n.includes('petroleo')) return <Factory className="text-[#22c55e]" size={24} />;
    if (n.includes('diesel')) return <Fuel className="text-[#22c55e]" size={24} />;
    return <Box className="text-[#22c55e]" size={24} />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {products.map((product, index) => (
        <div key={index} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] p-6 shadow-2xl transition-all hover:border-[#22c55e]/50">
          
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#22c55e]/5 blur-2xl transition-all group-hover:bg-[#22c55e]/10" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                {getIcon(product.nome)}
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">
                {product.setor}
              </span>
            </div>

            <h3 className="mb-6 text-xl font-black uppercase tracking-tighter text-white group-hover:text-[#22c55e] transition-colors leading-tight h-12">
              {product.nome}
            </h3>
            
            <div className="flex items-end justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cotação de Mercado</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-gray-500">{product.moeda_origem}</span>
                  <span className="text-3xl font-black text-white">
                    {Number(product.preco_original).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Link dinâmico vindo da coluna link_produto */}
              <a 
                href={product.link_produto || "https://www.noticiasagricolas.com.br/cotacoes/soja"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all hover:bg-[#22c55e] hover:text-black shadow-lg"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}