
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  ReceiptText,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBasket,
  CalendarDays,
  Trash2,
  PiggyBank,
  ChartNoAxesColumnIncreasing,
  Package,
} from 'lucide-react'

type Venda = {
  id: string
  anuncioId: string
  produto: string
  quantidade: number
  preco: number
  comprador: string
  data: string
}

type Despesa = {
  id: string
  descricao: string
  categoria: string
  valor: number
  data: string
}

type Movimentacao = {
  id: string
  titulo: string
  subtitulo: string
  valor: number
  data: string
  tipo: 'receita' | 'despesa'
}

const categorias = [
  'Transporte',
  'Embalagens',
  'Armazenamento',
  'Mão de obra',
  'Energia',
  'Outros',
]

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

function carregarDados<T>(chave: string): T[] {
  try {
    const conteudo = localStorage.getItem(chave)
    const dados: unknown = conteudo ? JSON.parse(conteudo) : []
    return Array.isArray(dados) ? dados as T[] : []
  } catch {
    return []
  }
}

function converterData(data: string): number {
  const partes = data.split('/')

  if (partes.length !== 3) return 0

  const [dia, mes, ano] = partes.map(Number)
  return new Date(ano, mes - 1, dia).getTime()
}

function obterDataAtual(): string {
  return new Date().toLocaleDateString('pt-BR')
}

function gerarId(): string {
  return crypto.randomUUID()
}

export default function Financeiro() {
  const [vendas, setVendas] = useState<Venda[]>(() =>
    carregarDados<Venda>('colheitasmart_vendas')
  )

  const [despesas, setDespesas] = useState<Despesa[]>(() =>
    carregarDados<Despesa>('colheitasmart_despesas')
  )

  const [modalAberto, setModalAberto] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('Transporte')
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState('')
  const [filtro, setFiltro] = useState<'todas' | 'receitas' | 'despesas'>('todas')

  useEffect(() => {
    localStorage.setItem(
      'colheitasmart_despesas',
      JSON.stringify(despesas)
    )
  }, [despesas])

  useEffect(() => {
    function atualizarVendas() {
      setVendas(carregarDados<Venda>('colheitasmart_vendas'))
    }

    window.addEventListener('focus', atualizarVendas)
    window.addEventListener('storage', atualizarVendas)

    return () => {
      window.removeEventListener('focus', atualizarVendas)
      window.removeEventListener('storage', atualizarVendas)
    }
  }, [])

  const receitas = useMemo(
    () => vendas.reduce(
      (total, venda) =>
        total + Number(venda.quantidade) * Number(venda.preco),
      0
    ),
    [vendas]
  )

  const totalDespesas = useMemo(
    () => despesas.reduce(
      (total, despesa) => total + Number(despesa.valor),
      0
    ),
    [despesas]
  )

  const resultado = receitas - totalDespesas

  const movimentacoes = useMemo<Movimentacao[]>(() => {
    const receitasRegistradas: Movimentacao[] = vendas.map(venda => ({
      id: `venda-${venda.id}`,
      titulo: `Venda de ${venda.produto}`,
      subtitulo: `${venda.quantidade} kg • ${venda.comprador}`,
      valor: Number(venda.quantidade) * Number(venda.preco),
      data: venda.data,
      tipo: 'receita',
    }))

    const despesasRegistradas: Movimentacao[] = despesas.map(despesa => ({
      id: `despesa-${despesa.id}`,
      titulo: despesa.descricao,
      subtitulo: despesa.categoria,
      valor: despesa.valor,
      data: despesa.data,
      tipo: 'despesa',
    }))

    return [...receitasRegistradas, ...despesasRegistradas]
      .sort((a, b) => converterData(b.data) - converterData(a.data))
  }, [vendas, despesas])

  const movimentacoesFiltradas = movimentacoes.filter(item => {
    if (filtro === 'receitas') return item.tipo === 'receita'
    if (filtro === 'despesas') return item.tipo === 'despesa'
    return true
  })

  const despesasPorCategoria = categorias.map(nome => ({
    nome,
    valor: despesas
      .filter(item => item.categoria === nome)
      .reduce((total, item) => total + item.valor, 0),
  })).filter(item => item.valor > 0)

  const maiorDespesa = Math.max(
    ...despesasPorCategoria.map(item => item.valor),
    1
  )

  function cadastrarDespesa(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const valorNumerico = Number(valor)

    if (!descricao.trim()) {
      setErro('Informe uma descrição para a despesa.')
      return
    }

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setErro('Informe um valor maior que zero.')
      return
    }

    const novaDespesa: Despesa = {
      id: gerarId(),
      descricao: descricao.trim(),
      categoria,
      valor: valorNumerico,
      data: obterDataAtual(),
    }

    setDespesas(anteriores => [novaDespesa, ...anteriores])

    setDescricao('')
    setCategoria('Transporte')
    setValor('')
    setErro('')
    setModalAberto(false)
  }

  function excluirDespesa(id: string) {
    const confirmado = window.confirm(
      'Deseja realmente excluir esta despesa?'
    )

    if (!confirmado) return

    setDespesas(anteriores =>
      anteriores.filter(despesa => despesa.id !== id)
    )
  }

  function abrirModal() {
    setErro('')
    setModalAberto(true)
  }

  const indicadores = [
    {
      titulo: 'Receitas',
      valor: receitas,
      descricao: `${vendas.length} vendas registradas`,
      icone: TrendingUp,
      cor: 'text-green-700',
      fundo: 'bg-green-50',
    },
    {
      titulo: 'Despesas',
      valor: totalDespesas,
      descricao: `${despesas.length} despesas registradas`,
      icone: TrendingDown,
      cor: 'text-orange-700',
      fundo: 'bg-orange-50',
    },
    {
      titulo: 'Resultado',
      valor: resultado,
      descricao: 'Receitas menos despesas',
      icone: PiggyBank,
      cor: 'text-[#073B2C]',
      fundo: 'bg-lime-50',
    },
  ]

  return (
    <main className="min-h-screen bg-[#F6F8F2]">
      <section className="bg-[#073B2C] px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="flex items-center gap-2 text-sm font-bold text-lime-300">
              <Sprout size={18} />
              SEU PAINEL
            </span>

            <h1 className="mt-4 text-4xl font-extrabold">
              Carteira
            </h1>

            <p className="mt-3 max-w-xl text-green-100">
              Acompanhe suas vendas, organize seus gastos e
              entenda o resultado financeiro da sua colheita.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8F34B] px-6 py-4 font-bold text-[#073B2C] transition hover:bg-lime-200"
          >
            <Plus size={20} />
            Nova despesa
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-5 md:grid-cols-3">
          {indicadores.map(indicador => {
            const Icone = indicador.icone

            return (
              <div
                key={indicador.titulo}
                className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-600">
                    {indicador.titulo}
                  </span>

                  <span className={`rounded-xl p-3 ${indicador.fundo}`}>
                    <Icone size={22} className={indicador.cor} />
                  </span>
                </div>

                <p className={`mt-5 text-3xl font-extrabold ${
                  indicador.titulo === 'Resultado' && resultado < 0
                    ? 'text-red-700'
                    : 'text-[#073B2C]'
                }`}>
                  {formatarMoeda(indicador.valor)}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {indicador.descricao}
                </p>
              </div>
            )
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl bg-[#073B2C] p-8 text-white lg:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-lime-300">
                  VISÃO FINANCEIRA
                </p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Resultado da colheita
                </h2>
              </div>

              <Wallet size={32} className="text-[#B8F34B]" />
            </div>

            <p className="mt-9 text-sm text-green-100">
              Receitas menos despesas registradas
            </p>

            <p className="mt-2 text-4xl font-extrabold sm:text-5xl">
              {formatarMoeda(resultado)}
            </p>

            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
              <div>
                <p className="flex items-center gap-2 text-sm text-green-100">
                  <ArrowUpRight size={17} />
                  Entradas
                </p>
                <p className="mt-2 text-xl font-bold">
                  {formatarMoeda(receitas)}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-green-100">
                  <ArrowDownRight size={17} />
                  Saídas
                </p>
                <p className="mt-2 text-xl font-bold">
                  {formatarMoeda(totalDespesas)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              <ChartNoAxesColumnIncreasing
                size={23}
                className="text-green-700"
              />
              <h2 className="text-xl font-extrabold text-[#073B2C]">
                Resumo financeiro
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Comparação entre entradas e saídas.
            </p>

            <div className="mt-9 space-y-7">
              {[
                {
                  nome: 'Receitas',
                  valor: receitas,
                  cor: 'bg-green-600',
                },
                {
                  nome: 'Despesas',
                  valor: totalDespesas,
                  cor: 'bg-orange-500',
                },
              ].map(item => {
                const maiorValor = Math.max(
                  receitas,
                  totalDespesas,
                  1
                )

                const largura = (item.valor / maiorValor) * 100

                return (
                  <div key={item.nome}>
                    <div className="mb-3 flex justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-700">
                        {item.nome}
                      </span>

                      <span className="font-bold text-[#073B2C]">
                        {formatarMoeda(item.valor)}
                      </span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.cor}`}
                        style={{ width: `${largura}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-9 rounded-2xl bg-[#F6F8F2] p-4">
              <p className="text-sm text-slate-600">
                {resultado > 0
                  ? 'Suas receitas estão acima das despesas registradas.'
                  : resultado < 0
                    ? 'Suas despesas estão acima das receitas registradas.'
                    : 'Receitas e despesas estão equilibradas ou ainda não há movimentações.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm lg:col-span-2">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#073B2C]">
                  Movimentações
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Acompanhe suas entradas e saídas.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todas', nome: 'Todas' },
                  { id: 'receitas', nome: 'Receitas' },
                  { id: 'despesas', nome: 'Despesas' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFiltro(item.id as typeof filtro)}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                      filtro === item.id
                        ? 'bg-[#073B2C] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-green-50'
                    }`}
                  >
                    {item.nome}
                  </button>
                ))}
              </div>
            </div>

            {movimentacoesFiltradas.length === 0 ? (
              <div className="py-16 text-center">
                <ReceiptText
                  size={45}
                  className="mx-auto text-green-700"
                />

                <h3 className="mt-4 text-lg font-bold text-[#073B2C]">
                  Nenhuma movimentação encontrada
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Suas receitas e despesas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="mt-7 space-y-3">
                {movimentacoesFiltradas.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`rounded-xl p-3 ${
                        item.tipo === 'receita'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}>
                        {item.tipo === 'receita'
                          ? <ArrowUpRight size={22} />
                          : <ArrowDownRight size={22} />}
                      </span>

                      <div>
                        <h3 className="font-bold text-[#073B2C]">
                          {item.titulo}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.subtitulo}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <CalendarDays size={13} />
                          {item.data}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className={`font-extrabold ${
                        item.tipo === 'receita'
                          ? 'text-green-700'
                          : 'text-orange-700'
                      }`}>
                        {item.tipo === 'receita' ? '+' : '-'}
                        {formatarMoeda(item.valor)}
                      </span>

                      {item.tipo === 'despesa' && (
                        <button
                          type="button"
                          onClick={() =>
                            excluirDespesa(item.id.replace('despesa-', ''))
                          }
                          aria-label={`Excluir ${item.titulo}`}
                          title="Excluir despesa"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <ReceiptText size={23} className="text-green-700" />
                <h2 className="text-xl font-extrabold text-[#073B2C]">
                  Gastos por categoria
                </h2>
              </div>

              {despesasPorCategoria.length === 0 ? (
                <div className="py-10 text-center">
                  <Package
                    size={37}
                    className="mx-auto text-green-700"
                  />
                  <p className="mt-3 text-sm text-slate-500">
                    Cadastre suas despesas para acompanhar
                    os principais custos.
                  </p>
                </div>
              ) : (
                <div className="mt-7 space-y-6">
                  {despesasPorCategoria.map(item => (
                    <div key={item.nome}>
                      <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="font-semibold text-slate-600">
                          {item.nome}
                        </span>

                        <span className="font-bold text-[#073B2C]">
                          {formatarMoeda(item.valor)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#89C83D] transition-all duration-500"
                          style={{
                            width: `${(item.valor / maiorDespesa) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-[#E7F5D6] p-7">
              <ShoppingBasket
                size={29}
                className="text-[#073B2C]"
              />

              <h2 className="mt-5 text-xl font-extrabold text-[#073B2C]">
                Continue vendendo
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Crie ofertas, registre suas vendas e acompanhe
                o resultado na Carteira.
              </p>

              <Link
                to="/vendas"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#073B2C] px-5 py-3 font-bold text-white transition hover:bg-green-800"
              >
                Vender Colheita
                <ArrowUpRight size={18} />
              </Link>
            </section>
          </div>
        </section>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={cadastrarDespesa}
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Nova despesa
              </h2>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                aria-label="Fechar"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                <X size={23} />
              </button>
            </div>

            <p className="mt-2 text-slate-500">
              Registre os custos relacionados à sua produção.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="descricaoDespesa"
                  className="mb-2 block font-semibold text-[#073B2C]"
                >
                  Descrição
                </label>

                <input
                  id="descricaoDespesa"
                  type="text"
                  required
                  maxLength={100}
                  value={descricao}
                  onChange={evento => setDescricao(evento.target.value)}
                  placeholder="Ex.: Transporte dos tomates"
                  className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label
                  htmlFor="categoriaDespesa"
                  className="mb-2 block font-semibold text-[#073B2C]"
                >
                  Categoria
                </label>

                <select
                  id="categoriaDespesa"
                  value={categoria}
                  onChange={evento => setCategoria(evento.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-green-600"
                >
                  {categorias.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="valorDespesa"
                  className="mb-2 block font-semibold text-[#073B2C]"
                >
                  Valor (R$)
                </label>

                <input
                  id="valorDespesa"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={valor}
                  onChange={evento => setValor(evento.target.value)}
                  placeholder="Ex.: 45.90"
                  className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-green-600"
                />
              </div>

              {erro && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white transition hover:bg-green-800"
              >
                Salvar despesa
              </button>
            </div>
          </form>
        </div>
      )}

      <footer className="bg-[#052B20] px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-extrabold"
            >
              <Sprout className="text-[#B8F34B]" />
              ColheitaSmart
            </Link>

            <p className="mt-3 text-sm text-green-100">
              Tecnologia para valorizar cada colheita.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-green-100">
            <Link to="/colheitas">Minha Colheita</Link>
            <Link to="/tarefas">O que fazer hoje?</Link>
            <Link to="/vendas">Vender Colheita</Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-6 text-sm text-green-200">
          © 2026 ColheitaSmart. Feito para quem cultiva o futuro. 🌱
        </div>
      </footer>
    </main>
  )
}
