
import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  Sprout,
} from 'lucide-react'
import { Link } from 'react-router-dom'

type Prioridade = 'Alta' | 'Média' | 'Baixa'

type Tarefa = {
  id: number
  produto: string
  emoji: string
  lote: string
  titulo: string
  descricao: string
  prioridade: Prioridade
  acao: string
}

const tarefasExemplo: Tarefa[] = [
  {
    id: 1,
    produto: 'Tomate',
    emoji: '🍅',
    lote: '#001',
    titulo: 'Verificar as condições dos tomates',
    descricao: 'Confira o estado dos frutos e separe aqueles que apresentarem sinais de deterioração.',
    prioridade: 'Alta',
    acao: 'Inspecionar o lote',
  },
  {
    id: 2,
    produto: 'Alface',
    emoji: '🥬',
    lote: '#003',
    titulo: 'Conferir a refrigeração da alface',
    descricao: 'Verifique se as condições de armazenamento estão adequadas e observe sinais de murchamento.',
    prioridade: 'Alta',
    acao: 'Verificar armazenamento',
  },
  {
    id: 3,
    produto: 'Morango',
    emoji: '🍓',
    lote: '#004',
    titulo: 'Inspecionar os morangos',
    descricao: 'Observe a aparência dos frutos e identifique possíveis sinais de danos ou mofo.',
    prioridade: 'Média',
    acao: 'Realizar inspeção',
  },
  {
    id: 4,
    produto: 'Banana',
    emoji: '🍌',
    lote: '#002',
    titulo: 'Acompanhar o amadurecimento',
    descricao: 'Observe o estágio de maturação e planeje a comercialização conforme a condição do lote.',
    prioridade: 'Média',
    acao: 'Avaliar maturação',
  },
  {
    id: 5,
    produto: 'Batata',
    emoji: '🥔',
    lote: '#006',
    titulo: 'Conferir o local de armazenamento',
    descricao: 'Observe a presença de umidade, danos ou sinais de brotação.',
    prioridade: 'Baixa',
    acao: 'Fazer conferência',
  },
]

const estilosPrioridade = {
  Alta: 'bg-red-50 text-red-700 border-red-200',
  Média: 'bg-amber-50 text-amber-700 border-amber-200',
  Baixa: 'bg-green-50 text-green-700 border-green-200',
}

export default function Tarefas() {
  const [filtro, setFiltro] = useState('Todas')
  const [busca, setBusca] = useState('')
  const [concluidas, setConcluidas] = useState<number[]>([])

  const pendentes = tarefasExemplo.filter(
    (tarefa) => !concluidas.includes(tarefa.id)
  )

  const tarefasFiltradas = useMemo(() => {
    return tarefasExemplo.filter((tarefa) => {
      const correspondeBusca =
        `${tarefa.produto} ${tarefa.titulo}`
          .toLowerCase()
          .includes(busca.toLowerCase())

      const correspondeFiltro =
        filtro === 'Todas' ||
        (filtro === 'Concluídas'
          ? concluidas.includes(tarefa.id)
          : filtro === 'Pendentes'
            ? !concluidas.includes(tarefa.id)
            : tarefa.prioridade === filtro)

      return correspondeBusca && correspondeFiltro
    })
  }, [busca, filtro, concluidas])

  function alternarConclusao(id: number) {
    setConcluidas((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((item) => item !== id)
        : [...anteriores, id]
    )
  }

  return (
    <main className="min-h-screen bg-[#F6F8F2]">
      <section className="bg-[#073B2C] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="flex items-center gap-2 text-sm font-semibold text-lime-300">
                <Sprout size={17} />
                SEU PAINEL
              </span>

              <h1 className="mt-3 text-4xl font-extrabold">
                O que fazer hoje?
              </h1>

              <p className="mt-3 max-w-xl text-green-100">
                Veja o que precisa de atenção e organize
                os próximos cuidados com sua colheita.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
              <ClipboardList size={27} className="text-lime-300" />
              <div>
                <p className="text-2xl font-extrabold">
                  {pendentes.length}
                </p>
                <p className="text-xs text-green-100">
                  Tarefas pendentes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-600">
                Prioridade alta
              </p>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <p className="mt-5 text-4xl font-extrabold text-[#073B2C]">
              {pendentes.filter((t) => t.prioridade === 'Alta').length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Ações mais urgentes
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-600">
                Outras pendências
              </p>
              <Clock3 className="text-amber-600" size={24} />
            </div>
            <p className="mt-5 text-4xl font-extrabold text-[#073B2C]">
              {pendentes.filter((t) => t.prioridade !== 'Alta').length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhar os lotes
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-600">
                Tarefas concluídas
              </p>
              <CheckCircle2 className="text-green-700" size={24} />
            </div>
            <p className="mt-5 text-4xl font-extrabold text-[#073B2C]">
              {concluidas.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Cuidados realizados
            </p>
          </div>
        </div>

        <section className="mt-8 flex flex-col gap-5 rounded-3xl bg-[#E7F5D6] p-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white p-3 text-green-800">
              <Leaf size={28} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#073B2C]">
                Comece pelo que é mais importante
              </h2>
              <p className="mt-2 max-w-2xl text-slate-700">
                Confira primeiro os lotes com prioridade alta.
                Depois, acompanhe as demais tarefas para
                manter sua produção organizada.
              </p>
            </div>
          </div>

          <Link
            to="/colheitas"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-5 py-3 font-bold text-white hover:bg-green-800"
          >
            Ver meus lotes <ArrowRight size={18} />
          </Link>
        </section>

        <section className="mt-10 rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Suas prioridades
              </h2>
              <p className="mt-2 text-slate-500">
                Marque uma tarefa como concluída depois de realizá-la.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar alimento..."
                  aria-label="Buscar tarefa"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>

              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                aria-label="Filtrar tarefas"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <option value="Todas">Todas as tarefas</option>
                <option value="Pendentes">Pendentes</option>
                <option value="Alta">Prioridade alta</option>
                <option value="Média">Prioridade média</option>
                <option value="Baixa">Prioridade baixa</option>
                <option value="Concluídas">Concluídas</option>
              </select>
            </div>
          </div>

          {tarefasFiltradas.length === 0 ? (
            <div className="py-16 text-center">
              <PackageCheck size={42} className="mx-auto text-green-600" />
              <h3 className="mt-4 font-bold text-[#073B2C]">
                Nenhuma tarefa encontrada
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Experimente mudar a pesquisa ou o filtro.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {tarefasFiltradas.map((tarefa) => {
                const concluida = concluidas.includes(tarefa.id)

                return (
                  <article
                    key={tarefa.id}
                    className={`rounded-2xl border p-6 transition ${
                      concluida
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-slate-200 hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F2F8EC] text-3xl">
                          {tarefa.emoji}
                        </span>
                        <div>
                          <p className="font-bold text-[#073B2C]">
                            {tarefa.produto}
                          </p>
                          <p className="text-xs text-slate-500">
                            Lote {tarefa.lote}
                          </p>
                        </div>
                      </div>

                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        concluida
                          ? 'border-green-200 bg-green-100 text-green-800'
                          : estilosPrioridade[tarefa.prioridade]
                      }`}>
                        {concluida ? 'Concluída' : `Prioridade ${tarefa.prioridade.toLowerCase()}`}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-extrabold text-[#073B2C]">
                      {tarefa.titulo}
                    </h3>

                    <p className="mt-3 min-h-18 leading-relaxed text-slate-600">
                      {tarefa.descricao}
                    </p>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <p className="mb-4 text-sm font-semibold text-slate-700">
                        <ShieldCheck size={16} className="mr-2 inline text-green-700" />
                        {tarefa.acao}
                      </p>

                      <button
                        type="button"
                        onClick={() => alternarConclusao(tarefa.id)}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition ${
                          concluida
                            ? 'border border-green-200 bg-white text-green-800 hover:bg-green-50'
                            : 'bg-[#073B2C] text-white hover:bg-green-800'
                        }`}
                      >
                        <CheckCircle2 size={19} />
                        {concluida ? 'Desfazer conclusão' : 'Marcar como concluída'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* RODAPÉ */}
      <footer className="mt-12 bg-[#052B20] px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-3 text-xl font-extrabold">
              <span className="rounded-xl bg-[#B8F34B] p-2 text-[#073B2C]">
                <Sprout size={23} />
              </span>
              ColheitaSmart
            </Link>
            <p className="mt-5 max-w-xs leading-relaxed text-green-100">
              Tecnologia para valorizar cada colheita,
              reduzir desperdícios e criar novas oportunidades.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#B8F34B]">
              Navegação
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-green-100">
              <Link to="/" className="hover:text-white">Início</Link>
              <Link to="/colheitas" className="hover:text-white">Minha Colheita</Link>
              <Link to="/tarefas" className="hover:text-white">O que fazer hoje?</Link>
              <Link to="/vendas" className="hover:text-white">Vender minha Colheita</Link>
              <Link to="/financeiro" className="hover:text-white">Meu Dinheiro</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#B8F34B]">
              Conheça o projeto
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-green-100">
              <Link to="/sobre" className="hover:text-white">Sobre nós</Link>
              <Link to="/integrantes" className="hover:text-white">Nossa equipe</Link>
              <Link to="/faq" className="hover:text-white">Perguntas frequentes</Link>
              <Link to="/contato" className="hover:text-white">Contato</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/15 pt-6 text-sm text-green-200 sm:flex-row">
          <span>© 2026 ColheitaSmart. Todos os direitos reservados.</span>
          <span>Feito para quem cultiva o futuro. 🌱</span>
        </div>
      </footer>
    </main>
  )
}
