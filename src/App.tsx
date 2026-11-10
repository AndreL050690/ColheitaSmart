import { Sprout, ArrowRight, Leaf, TrendingUp, ShieldCheck } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7faf6]">
      <header className="bg-white border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-800 font-bold text-xl">
            <Sprout size={28} />
            ColheitaSmart
          </div>

          <span className="text-sm text-green-700 font-medium">
            Sua colheita vale mais.
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <span className="text-green-700 font-semibold">
            TECNOLOGIA PARA O CAMPO
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-green-950 mt-5 leading-tight">
            Cuide melhor da sua colheita.
            <span className="text-green-600"> Perca menos. Ganhe mais.</span>
          </h1>

          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            Organize seus lotes, acompanhe seus alimentos e tome
            decisões mais inteligentes depois da colheita.
          </p>

          <a
            href="#beneficios"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-4 rounded-xl font-semibold mt-8 hover:bg-green-800 transition"
          >
            Conhecer benefícios
            <ArrowRight size={20} />
          </a>
        </div>

        <section
          id="beneficios"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
        >
          {[
            {
              icon: <Leaf size={28} />,
              title: 'Minha Colheita',
              text: 'Cadastre e acompanhe seus lotes em um só lugar.',
            },
            {
              icon: <ShieldCheck size={28} />,
              title: 'Menos perdas',
              text: 'Identifique quais alimentos precisam de atenção.',
            },
            {
              icon: <TrendingUp size={28} />,
              title: 'Mais oportunidades',
              text: 'Simule vendas e acompanhe o valor da produção.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-green-100 rounded-2xl p-8 shadow-sm"
            >
              <div className="text-green-700 mb-5">{item.icon}</div>
              <h2 className="text-xl font-bold text-green-950">
                {item.title}
              </h2>
              <p className="text-gray-600 mt-3">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}