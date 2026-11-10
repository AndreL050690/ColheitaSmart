
import { useMemo, useState } from 'react'
import {
  Plus, Search, Package, Scale, AlertTriangle,
  CalendarDays, ArrowRight, Sprout
} from 'lucide-react'

type Lote = {
  id: number
  produto: string
  emoji: string
  quantidade: number
  data: string
  armazenamento: string
  status: 'Bom' | 'Atenção'
}

const lotesExemplo: Lote[] = [
  { id: 1, produto: 'Tomate', emoji: '🍅', quantidade: 120, data: '08/11/2026', armazenamento: 'Ambiente fresco', status: 'Atenção' },
  { id: 2, produto: 'Banana', emoji: '🍌', quantidade: 180, data: '09/11/2026', armazenamento: 'Local ventilado', status: 'Bom' },
  { id: 3, produto: 'Alface', emoji: '🥬', quantidade: 40, data: '10/11/2026', armazenamento: 'Refrigeração', status: 'Atenção' },
  { id: 4, produto: 'Morango', emoji: '🍓', quantidade: 25, data: '10/11/2026', armazenamento: 'Refrigeração', status: 'Bom' },
  { id: 5, produto: 'Manga', emoji: '🥭', quantidade: 75, data: '07/11/2026', armazenamento: 'Local ventilado', status: 'Bom' },
  { id: 6, produto: 'Batata', emoji: '🥔', quantidade: 100, data: '06/11/2026', armazenamento: 'Local seco', status: 'Bom' },
]

export default function MinhaColheita() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')

  const lotesFiltrados = useMemo(() => {
    return lotesExemplo.filter((lote) => {
      const correspondeBusca = lote.produto
        .toLowerCase()
        .includes(busca.toLowerCase())

      const correspondeFiltro =
        filtro === 'Todos' || lote.status === filtro

      return correspondeBusca && correspondeFiltro
    })
  }, [busca, filtro])

  const pesoTotal = lotesExemplo.reduce(
    (total, lote) => total + lote.quantidade, 0
  )
  const precisamAtencao = lotesExemplo.filter(
    (lote) => lote.status === 'Atenção'
  ).length

  return (
    <main className="min-h-screen bg-[#F6F8F2]">
      <section className="bg-[#073B2C] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="flex items-center gap-2 text-sm font-semibold text-lime-300">
                <Sprout size={17} /> SEU PAINEL
              </span>
              <h1 className="mt-3 text-4xl font-extrabold">
                Minha Colheita
              </h1>
              <p className="mt-3 text-green-100">
                Acompanhe seus alimentos em um só lugar.
              </p>
            </div>

            <button
              type="button"
              disabled
              title="Cadastro será implementado na próxima etapa"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-6 py-4 font-bold text-green-950 opacity-70"
            >
              <Plus size={20} /> Nova colheita
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="mb-5 text-sm text-slate-500">
          Dados demonstrativos — ainda não conectados ao banco de dados.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { titulo: 'Lotes cadastrados', valor: lotesExemplo.length, unidade: 'lotes', icone: Package },
            { titulo: 'Peso total', valor: pesoTotal, unidade: 'kg', icone: Scale },
            { titulo: 'Precisam de atenção', valor: precisamAtencao, unidade: 'lotes', icone: AlertTriangle },
          ].map((indicador) => {
            const Icone = indicador.icone
            return (
              <div key={indicador.titulo} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-600">{indicador.titulo}</p>
                  <Icone size={23} className="text-green-700" />
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <strong className="text-4xl text-[#073B2C]">{indicador.valor}</strong>
                  <span className="text-sm text-slate-500">{indicador.unidade}</span>
                </div>
              </div>
            )
          })}
        </div>

        <section className="mt-10 rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Seus lotes
              </h2>
              <p className="mt-1 text-slate-500">
                Consulte as informações das suas colheitas.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                <Search size={19} className="text-slate-400" />
                <input
                  value={busca}
                  onChange={(evento) => setBusca(evento.target.value)}
                  placeholder="Buscar alimento..."
                  aria-label="Buscar alimento"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>

              <select
                value={filtro}
                onChange={(evento) => setFiltro(evento.target.value)}
                aria-label="Filtrar por situação"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="Todos">Todos os lotes</option>
                <option value="Bom">Em boas condições</option>
                <option value="Atenção">Precisam de atenção</option>
              </select>
            </div>
          </div>

          {lotesFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={40} className="mx-auto text-slate-300" />
              <h3 className="mt-4 font-bold text-slate-700">
                Nenhum lote encontrado
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Tente mudar a busca ou o filtro.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {lotesFiltrados.map((lote) => (
                <article
                  key={lote.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-green-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl">
                        {lote.emoji}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#073B2C]">
                          {lote.produto}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Lote #{String(lote.id).padStart(3, '0')}
                        </p>
                      </div>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      lote.status === 'Bom'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lote.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantidade</span>
                      <strong className="text-slate-800">{lote.quantidade} kg</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <CalendarDays size={15} /> Colheita
                      </span>
                      <span className="text-slate-700">{lote.data}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Armazenamento</span>
                      <span className="text-right text-slate-700">{lote.armazenamento}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-400">
                    Ver detalhes <ArrowRight size={16} />
                    <span className="ml-auto text-xs font-normal">
                      Em breve
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          ColheitaSmart — Sua colheita vale mais.
        </p>
      </div>
    </main>
  )
}
