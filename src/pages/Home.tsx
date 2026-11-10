
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Sprout, Package,
  TrendingUp, ShieldCheck, CheckCircle2,
  Leaf, Wallet, ClipboardList, BarChart3
} from 'lucide-react'

const recursos = [
  {
    icone: Package,
    titulo: 'Minha Colheita',
    descricao: 'Todos os seus lotes organizados em um único lugar.',
    rota: '/colheitas',
  },
  {
    icone: ClipboardList,
    titulo: 'O que fazer hoje?',
    descricao: 'Saiba quais alimentos precisam da sua atenção.',
    rota: '/tarefas',
  },
  {
    icone: TrendingUp,
    titulo: 'Vender minha Colheita',
    descricao: 'Simule preços e prepare ofertas para seus clientes.',
    rota: '/vendas',
  },
  {
    icone: Wallet,
    titulo: 'Meu Dinheiro',
    descricao: 'Acompanhe os valores da sua produção.',
    rota: '/financeiro',
  },
]

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative bg-[#073B2C] text-white">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-white/10 px-4 py-2 text-sm font-medium text-lime-200">
              <Sprout size={17} />
              Tecnologia simples para quem produz
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              Sua colheita
              <span className="block text-[#B8F34B]">vale mais.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-green-100">
              Menos desperdício, mais oportunidades.
              Organize seus alimentos, acompanhe seus lotes
              e tome decisões melhores depois da colheita.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/colheitas"
                className="inline-flex items-center gap-3 rounded-xl bg-[#B8F34B] px-7 py-4 font-bold text-[#073B2C] transition hover:bg-lime-200"
              >
                Começar agora <ArrowRight size={20} />
              </Link>

              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-semibold transition hover:bg-white/10"
              >
                Conhecer o projeto
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-sm text-green-100">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-lime-300" />
                Fácil de usar
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-lime-300" />
                Feito para pequenos agricultores
              </span>
            </div>
          </div>

          {/* PRÉVIA ILUSTRATIVA DO PAINEL */}
          <div className="relative">
            <div className="rounded-[28px] border border-white/20 bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                    Visão geral
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#073B2C]">
                    Minha Colheita
                  </h2>
                </div>
                <span className="rounded-xl bg-green-50 p-3 text-green-700">
                  <Leaf size={24} />
                </span>
              </div>

              <p className="mt-5 text-xs text-slate-400">
                Exemplo ilustrativo do painel
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#F2F8EC] p-5">
                  <Package className="text-green-700" size={23} />
                  <p className="mt-4 text-3xl font-extrabold text-[#073B2C]">06</p>
                  <p className="mt-1 text-sm text-slate-600">Lotes cadastrados</p>
                </div>
                <div className="rounded-2xl bg-[#F2F8EC] p-5">
                  <BarChart3 className="text-green-700" size={23} />
                  <p className="mt-4 text-3xl font-extrabold text-[#073B2C]">420 kg</p>
                  <p className="mt-1 text-sm text-slate-600">Peso disponível</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-[#073B2C]">Lotes recentes</h3>
                  <span className="text-xs text-slate-400">Demonstração</span>
                </div>

                {[
                  { nome: 'Tomate', peso: '120 kg', emoji: '🍅', cor: 'bg-red-50' },
                  { nome: 'Banana', peso: '180 kg', emoji: '🍌', cor: 'bg-yellow-50' },
                  { nome: 'Alface', peso: '120 kg', emoji: '🥬', cor: 'bg-green-50' },
                ].map((lote) => (
                  <div key={lote.nome} className="mb-2 flex items-center justify-between rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${lote.cor}`}>
                        {lote.emoji}
                      </span>
                      <span className="font-semibold text-slate-800">{lote.nome}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-500">{lote.peso}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/colheitas"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-5 py-3 font-bold text-white transition hover:bg-green-800"
              >
                Abrir meu painel <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="bg-[#F6F8F2] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-green-700">
              Tudo em um só lugar
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-[#073B2C] md:text-4xl">
              O controle da sua colheita começa aqui.
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Quatro ferramentas simples para facilitar o dia a dia de quem produz.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recursos.map((recurso) => {
              const Icone = recurso.icone

              return (
                <Link
                  key={recurso.titulo}
                  to={recurso.rota}
                  className="group rounded-3xl border border-green-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5D8] text-green-800">
                    <Icone size={27} />
                  </div>
                  <h3 className="mt-7 text-xl font-bold text-[#073B2C]">
                    {recurso.titulo}
                  </h3>
                  <p className="mt-3 min-h-20 leading-relaxed text-slate-600">
                    {recurso.descricao}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-green-700 group-hover:gap-3">
                    Acessar <ArrowRight size={17} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-green-700">
              Simples do começo ao fim
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-[#073B2C] md:text-4xl">
              Tecnologia que entende a rotina do campo.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Você não precisa entender de tecnologia para cuidar melhor
              da sua produção. O ColheitaSmart foi pensado para tornar
              as decisões do pós-colheita mais fáceis.
            </p>
            <Link to="/sobre" className="mt-7 inline-flex items-center gap-2 font-bold text-green-700">
              Saiba mais sobre nós <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl bg-[#F6F8F2] p-7 sm:p-10">
            {[
              ['01', 'Cadastre sua colheita', 'Informe o produto, a quantidade e as condições do lote.'],
              ['02', 'Acompanhe seus alimentos', 'Veja seus registros e identifique o que precisa de atenção.'],
              ['03', 'Planeje suas vendas', 'Compare valores e organize as próximas decisões.'],
            ].map(([numero, titulo, descricao]) => (
              <div key={numero} className="flex gap-5 border-b border-green-100 py-6 last:border-0">
                <span className="text-2xl font-black text-green-700">{numero}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#073B2C]">{titulo}</h3>
                  <p className="mt-2 text-slate-600">{descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="bg-[#B8F34B] px-6 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-[#073B2C]">
              Cada colheita tem valor.
            </h2>
            <p className="mt-2 text-green-950">
              Comece a organizar sua produção com mais facilidade.
            </p>
          </div>
          <Link to="/colheitas" className="inline-flex items-center gap-2 rounded-xl bg-[#073B2C] px-7 py-4 font-bold text-white hover:bg-green-900">
            Começar agora <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <footer className="bg-[#052B20] px-6 py-8 text-green-100">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm sm:flex-row">
          <span className="font-bold">🌱 ColheitaSmart</span>
          <span>Global Solution FIAP 2026 — Sua colheita vale mais.</span>
        </div>
      </footer>
    </main>
  )
}
