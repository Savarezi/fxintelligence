export default function Solucoes() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-4xl md:text-5xl font-bold text-green-400">
          Marketplace Corporativo B2B
        </h1>

        <p className="text-gray-400 mt-6 max-w-2xl">
          Catálogo corporativo com soluções tecnológicas para empresas.
          Preços e especificações voltados ao ambiente empresarial.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

          {/* Produto 1 */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition duration-300 group">
            <div className="absolute top-3 left-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              B2B
            </div>
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              Destaque
            </div>
            <div className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
                alt="Notebook Corporativo"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Notebook Corporativo Dell</h2>
              <p className="text-green-400 text-2xl font-bold mt-4">R$ 5.890,00</p>
              <span className="text-sm text-gray-400 block mt-2">
                Categoria: Tecnologia Empresarial
              </span>
            </div>
          </div>

          {/* Produto 2 */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition duration-300 group">
            <div className="absolute top-3 left-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              B2B
            </div>
            <div className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"
                alt="Smartphone Corporativo"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Smartphone Corporativo</h2>
              <p className="text-green-400 text-2xl font-bold mt-4">R$ 2.499,00</p>
              <span className="text-sm text-gray-400 block mt-2">
                Categoria: Mobilidade Empresarial
              </span>
            </div>
          </div>

          {/* Produto 3 */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition duration-300 group">
            <div className="absolute top-3 left-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              B2B
            </div>
            <div className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=1200&auto=format&fit=crop"
                alt="Headset Corporativo"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Headset Profissional</h2>
              <p className="text-green-400 text-2xl font-bold mt-4">R$ 899,00</p>
              <span className="text-sm text-gray-400 block mt-2">
                Categoria: Equipamentos Corporativos
              </span>
            </div>
          </div>

          {/* Produto 4 */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition duration-300 group">
            <div className="absolute top-3 left-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              B2B
            </div>
            <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              Destaque
            </div>
            <div className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop"
                alt='Monitor 27" 4K'
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Monitor 27" 4K</h2>
              <p className="text-green-400 text-2xl font-bold mt-4">R$ 3.200,00</p>
              <span className="text-sm text-gray-400 block mt-2">
                Categoria: Infraestrutura de TI
              </span>
            </div>
          </div>

          {/* Produto 5 */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition duration-300 group">
            <div className="absolute top-3 left-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              B2B
            </div>
            <div className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1200&auto=format&fit=crop"
                alt="Servidor Empresarial"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Servidor Rack Corporativo</h2>
              <p className="text-green-400 text-2xl font-bold mt-4">R$ 18.900,00</p>
              <span className="text-sm text-gray-400 block mt-2">
                Categoria: Data Center
              </span>
            </div>
          </div>

          {/* Produto 6 */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition duration-300 group">
            <div className="absolute top-3 left-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
              B2B
            </div>
            <div className="overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=1200&auto=format&fit=crop"
                alt="Switch Corporativo"
                className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">Switch Gerenciável 48 Portas</h2>
              <p className="text-green-400 text-2xl font-bold mt-4">R$ 6.750,00</p>
              <span className="text-sm text-gray-400 block mt-2">
                Categoria: Redes Corporativas
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}