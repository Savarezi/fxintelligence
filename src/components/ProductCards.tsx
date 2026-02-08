import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Box, Fuel, Factory } from 'lucide-react';

export default function ProductCards() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Buscamos os dados da tabela
        const { data, error }: any = await supabase
          .from('produtos_globais' as any)
          .select('*')
          .limit(3); // Pega os 3 primeiros que encontrar para garantir que apareça algo

        if (error) {
          console.error("Erro Supabase:", error);
          return;
        }

        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Erro crítico:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Se estiver carregando, mostra um aviso discreto
  if (loading) return <div className="text-[#22c55e] font-mono text-xs p-4 animate-pulse"> > SYNC_COMMODITIES...</div>;
  
  // Se não houver dados, mostra um aviso para não ficar o buraco vazio
  if (products.length === 0) return <div className="text-gray-600 font-mono text-xs p-4 italic"> > NENHUM_DADO_COMMODITY_ENCONTRADO</div>;

  const getIcon = (nome: string) => {
    const n = nome?.toLowerCase() || "";
    if (n.includes('petrol')) return <Factory className="text-[#22c55e]" size={24} />;
    if (n.includes('diesel')) return <Fuel className="text-[#22c55e]" size={24} />;
    return <Box className="text-[#22c55e]" size={24} />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 font-mono">
      {products.map((product, index) => (
        <div key={index} className="bg-black border border-[#22c55e]/20 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-[#22c55e]/5 p-3 border border-[#22c55e]/10">
              {getIcon(product.nome)}
            </div>
            <span className="text-[10px] font-bold text-[#22c55e]/50 border border-[#22c55e]/20 px-2 py-1 rounded">
              {product.setor || 'DADO_GLOBAL'}
            </span>
          </div>
          
          <h3 className="mb-4 text-lg font-bold text-white uppercase truncate">
            {product.nome}
          </h3>
          
          <div className="flex items-baseline gap-1 border-t border-[#22c55e]/10 pt-4">
            <span className="text-[#22c55e] text-2xl font-black">
              R$ {Number(product.preco_original || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-gray-600 text-[10px]">/un</span>
          </div>
        </div>
      ))}
    </div>
  );
}