import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Box, Fuel, Factory } from 'lucide-react';

export default function ProductCards() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('produtos_globais')
        .select('nome, setor, preco_original, moeda_origem, link_produto')
        .or('nome.ilike.*Soja*,nome.ilike.*Petróleo*,nome.ilike.*Diesel*')
        .order('criado_em', { ascending: false });

      if (data) {
        const uniqueProducts = data.reduce((acc: any[], current) => {
          const x = acc.find(item => item.nome === current.nome);
          if (!x) return acc.concat([current]);
          else return acc;
        }, []);
        setProducts(uniqueProducts);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500 uppercase font-bold animate-pulse tracking-widest">Sincronizando Commodities...</div>;

  // Função para colocar um ícone de acordo com o nome do produto
  const getIcon = (nome: string) => {
    if (nome.toLowerCase().includes('petróleo')) return <Factory className="text-[#22c55e]" size={24} />;
    if (nome.toLowerCase().includes('diesel')) return <Fuel className="text-[#22c55e]" size={24} />;
    return <Box className="text-[#22c55e]" size={24} />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {products.map((product, index) => (
        <div key={index} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] p-6 shadow-2xl transition-all hover:border-[#22c55e]/50">
          
          {/* Efeito de brilho no fundo ao passar o mouse */}
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

            <h3 className="mb-6 text-xl font-black uppercase tracking-tighter text-white group-hover:text-[#22c55e] transition-colors">
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

              <a 
                href={product.link_produto} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all hover:bg-[#22c55e] hover:text-black shadow-lg"
                title="Ver detalhes"
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