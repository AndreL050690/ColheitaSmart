import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Package,
  Plus,
  Search,
  ShoppingBasket,
  Sprout,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'

type Lote = {
  id: string
  produto: string
  emoji?: string
  quantidade: number
  data?: string
  armazenamento?: string
  temperatura?: string | number
  status?: string
}

type Anuncio = {
  id: string
  loteId?: string
  produto: string
  quantidade: number
  preco: number
  data: string
  status: 'Ativo' | 'Encerrado'
}

type Venda = {
  id: string
  anuncioId: string
  loteId?: string
  produto: string
  quantidade: number
  preco: number
  comprador: string
  data: string
}

type Aba = 'resumo' | 'anuncios' | 'historico'

const CHAVE_LOTES = 'colheitasmart_lotes'
const CHAVE_ANUNCIOS = 'colheitasmart_anuncios'
const CHAVE_VENDAS = 'colheitasmart_vendas'

const EMOJIS: Record<string, string> = {
  tomate: '🍅',
  banana: '🍌',
  alface: '🥬',
  morango: '🍓',
  manga: '🥭',
  batata: '🥔',
}

function emojiProduto(produto: string) {
  return EMOJIS[produto.toLowerCase()] ?? '🌱'
}

function moeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function peso(valor: number) {
  return valor.toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
  })
}

function arredondar(valor: number) {
  return Math.round((valor + Number.EPSILON) * 100) / 100
}

function numeroValido(valor: unknown) {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    valor >= 0
  )
}

function carregar<T>(chave: string): T[] {
  try {
    const dados = localStorage.getItem(chave)

    if (!dados) {
      return []
    }

    const resultado: unknown = JSON.parse(dados)

    return Array.isArray(resultado)
      ? (resultado as T[])
      : []
  } catch {
    return []
  }
}

function gerarId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function dataAtual() {
  return new Date().toLocaleDateString('pt-BR')
}

export default function Vendas() {
  const [aba, setAba] = useState<Aba>('resumo')

  const [lotes, setLotes] = useState<Lote[]>(() =>
    carregar<Lote>(CHAVE_LOTES)
  )

  const [anuncios, setAnuncios] = useState<Anuncio[]>(() =>
    carregar<Anuncio>(CHAVE_ANUNCIOS)
  )

  const [vendas, setVendas] = useState<Venda[]>(() =>
    carregar<Venda>(CHAVE_VENDAS)
  )

  const [modalAnuncio, setModalAnuncio] = useState(false)
  const [modalVenda, setModalVenda] = useState<string | null>(null)

  const [loteSelecionadoId, setLoteSelecionadoId] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [preco, setPreco] = useState('')

  const [quantidadeVenda, setQuantidadeVenda] = useState('')
  const [comprador, setComprador] = useState('')

  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    function atualizarLotes() {
      setLotes(carregar<Lote>(CHAVE_LOTES))
    }

    function atualizarDados(evento: StorageEvent) {
      if (evento.key === CHAVE_LOTES) {
        atualizarLotes()
      }

      if (evento.key === CHAVE_ANUNCIOS) {
        setAnuncios(carregar<Anuncio>(CHAVE_ANUNCIOS))
      }

      if (evento.key === CHAVE_VENDAS) {
        setVendas(carregar<Venda>(CHAVE_VENDAS))
      }
    }

    window.addEventListener('focus', atualizarLotes)
    window.addEventListener('storage', atualizarDados)

    return () => {
      window.removeEventListener('focus', atualizarLotes)
      window.removeEventListener('storage', atualizarDados)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      CHAVE_ANUNCIOS,
      JSON.stringify(anuncios)
    )
  }, [anuncios])

  useEffect(() => {
    localStorage.setItem(
      CHAVE_VENDAS,
      JSON.stringify(vendas)
    )
  }, [vendas])

  const lotesValidos = useMemo(() => {
    return lotes.filter(
      lote =>
        typeof lote.id === 'string' &&
        typeof lote.produto === 'string' &&
        numeroValido(lote.quantidade)
    )
  }, [lotes])

  const loteSelecionado = lotesValidos.find(
    lote => lote.id === loteSelecionadoId
  )

  const anuncioSelecionado = anuncios.find(
    anuncio => anuncio.id === modalVenda
  )

  function vendasDoLote(loteId: string) {
    return vendas
      .filter(venda => venda.loteId === loteId)
      .reduce(
        (total, venda) => total + venda.quantidade,
        0
      )
  }

  function quantidadeVendidaAnuncio(anuncioId: string) {
    return vendas
      .filter(venda => venda.anuncioId === anuncioId)
      .reduce(
        (total, venda) => total + venda.quantidade,
        0
      )
  }

  function quantidadeDisponivelAnuncio(anuncio: Anuncio) {
    return Math.max(
      0,
      arredondar(
        anuncio.quantidade -
          quantidadeVendidaAnuncio(anuncio.id)
      )
    )
  }

  function estoqueFisicoLote(lote: Lote) {
    return Math.max(
      0,
      arredondar(
        lote.quantidade - vendasDoLote(lote.id)
      )
    )
  }

  function quantidadeReservadaLote(loteId: string) {
    return arredondar(
      anuncios
        .filter(
          anuncio =>
            anuncio.loteId === loteId &&
            anuncio.status === 'Ativo'
        )
        .reduce(
          (total, anuncio) =>
            total + quantidadeDisponivelAnuncio(anuncio),
          0
        )
    )
  }

  function estoqueLivreLote(lote: Lote) {
    return Math.max(
      0,
      arredondar(
        estoqueFisicoLote(lote) -
          quantidadeReservadaLote(lote.id)
      )
    )
  }

  function disponibilidadeVenda(anuncio: Anuncio) {
    if (!anuncio.loteId || anuncio.status !== 'Ativo') {
      return 0
    }

    const lote = lotesValidos.find(
      item => item.id === anuncio.loteId
    )

    if (!lote) {
      return 0
    }

    return Math.max(
      0,
      Math.min(
        quantidadeDisponivelAnuncio(anuncio),
        estoqueFisicoLote(lote)
      )
    )
  }

  const lotesComEstoque = lotesValidos.filter(
    lote => estoqueLivreLote(lote) > 0
  )

  const anunciosAtivos = anuncios.filter(
    anuncio =>
      anuncio.status === 'Ativo' &&
      disponibilidadeVenda(anuncio) > 0
  )

  const receitaTotal = vendas.reduce(
    (total, venda) =>
      total + venda.quantidade * venda.preco,
    0
  )

  const pesoVendido = vendas.reduce(
    (total, venda) => total + venda.quantidade,
    0
  )

  const estoqueTotal = lotesValidos.reduce(
    (total, lote) => total + estoqueFisicoLote(lote),
    0
  )

  const estoqueLivreTotal = lotesValidos.reduce(
    (total, lote) => total + estoqueLivreLote(lote),
    0
  )

  const anunciosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return anuncios.filter(anuncio =>
      anuncio.produto.toLowerCase().includes(termo)
    )
  }, [anuncios, busca])

  function abrirModalAnuncio() {
    const lotesAtualizados = carregar<Lote>(CHAVE_LOTES)
    setLotes(lotesAtualizados)

    const primeiroLote = lotesAtualizados.find(
      lote =>
        numeroValido(lote.quantidade) &&
        lote.quantidade > 0
    )

    setLoteSelecionadoId(primeiroLote?.id ?? '')
    setQuantidade('')
    setPreco('')
    setErro('')
    setModalAnuncio(true)
  }

  function fecharModalAnuncio() {
    setModalAnuncio(false)
    setErro('')
  }

  function fecharModalVenda() {
    setModalVenda(null)
    setQuantidadeVenda('')
    setComprador('')
    setErro('')
  }

  function criarAnuncio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const lote = lotesValidos.find(
      item => item.id === loteSelecionadoId
    )

    const qtd = Number(quantidade)
    const valor = Number(preco)

    if (!lote) {
      setErro('Selecione um lote cadastrado.')
      return
    }

    if (
      !Number.isFinite(qtd) ||
      qtd <= 0 ||
      arredondar(qtd) !== qtd
    ) {
      setErro('Informe uma quantidade válida, com até duas casas decimais.')
      return
    }

    if (
      !Number.isFinite(valor) ||
      valor <= 0 ||
      arredondar(valor) !== valor
    ) {
      setErro('Informe um preço válido, com até duas casas decimais.')
      return
    }

    const disponivel = estoqueLivreLote(lote)

    if (qtd > disponivel) {
      setErro(
        `Esse lote possui apenas ${peso(disponivel)} kg livres para novos anúncios.`
      )
      return
    }

    const novoAnuncio: Anuncio = {
      id: gerarId(),
      loteId: lote.id,
      produto: lote.produto,
      quantidade: qtd,
      preco: valor,
      data: dataAtual(),
      status: 'Ativo',
    }

    setAnuncios(anteriores => [
      novoAnuncio,
      ...anteriores,
    ])

    setQuantidade('')
    setPreco('')
    setErro('')
    setModalAnuncio(false)
    setAba('anuncios')
  }

  function registrarVenda(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (!anuncioSelecionado) {
      return
    }

    if (!anuncioSelecionado.loteId) {
      setErro('Esse anúncio antigo não está vinculado a um lote.')
      return
    }

    const qtd = Number(quantidadeVenda)
    const disponivel = disponibilidadeVenda(
      anuncioSelecionado
    )

    if (
      !Number.isFinite(qtd) ||
      qtd <= 0 ||
      arredondar(qtd) !== qtd ||
      qtd > disponivel
    ) {
      setErro(
        `Informe uma quantidade válida de até ${peso(disponivel)} kg.`
      )
      return
    }

    if (!comprador.trim()) {
      setErro('Informe o nome do comprador.')
      return
    }

    const novaVenda: Venda = {
      id: gerarId(),
      anuncioId: anuncioSelecionado.id,
      loteId: anuncioSelecionado.loteId,
      produto: anuncioSelecionado.produto,
      quantidade: qtd,
      preco: anuncioSelecionado.preco,
      comprador: comprador.trim(),
      data: dataAtual(),
    }

    setVendas(anteriores => [
      novaVenda,
      ...anteriores,
    ])

    const restante = arredondar(
      quantidadeDisponivelAnuncio(anuncioSelecionado) -
        qtd
    )

    if (restante <= 0) {
      setAnuncios(anteriores =>
        anteriores.map(anuncio =>
          anuncio.id === anuncioSelecionado.id
            ? { ...anuncio, status: 'Encerrado' }
            : anuncio
        )
      )
    }

    fecharModalVenda()
    setAba('historico')
  }

  function encerrarAnuncio(id: string) {
    setAnuncios(anteriores =>
      anteriores.map(anuncio =>
        anuncio.id === id
          ? { ...anuncio, status: 'Encerrado' }
          : anuncio
      )
    )
  }

  function compartilhar(anuncio: Anuncio) {
    const disponivel = disponibilidadeVenda(anuncio)

    if (disponivel <= 0) {
      return
    }

    const mensagem = [
      '🌱 *COLHEITASMART — COLHEITA À VENDA*',
      '',
      `🥬 Produto: ${anuncio.produto}`,
      `📦 Quantidade disponível: ${peso(disponivel)} kg`,
      `💰 Preço: ${moeda(anuncio.preco)}/kg`,
      '',
      'Entre em contato para negociar!',
    ].join('\n')

    window.open(
      `https://wa.me/?text=${encodeURIComponent(mensagem)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const cartoes = [
    {
      titulo: 'Anúncios ativos',
      valor: String(anunciosAtivos.length),
      detalhe: 'Ofertas disponíveis',
      icone: ShoppingBasket,
    },
    {
      titulo: 'Vendas realizadas',
      valor: String(vendas.length),
      detalhe: `${peso(pesoVendido)} kg vendidos`,
      icone: CheckCircle2,
    },
    {
      titulo: 'Total vendido',
      valor: moeda(receitaTotal),
      detalhe: 'Valor bruto registrado',
      icone: Wallet,
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
              Vender minha Colheita
            </h1>

            <p className="mt-3 max-w-xl text-green-100">
              Transforme seus lotes cadastrados em oportunidades
              de venda. Anuncie, negocie e acompanhe seus resultados.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirModalAnuncio}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8F34B] px-6 py-4 font-bold text-[#073B2C] transition hover:bg-lime-200"
          >
            <Plus size={20} />
            Criar anúncio
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {cartoes.map(item => {
            const Icone = item.icone

            return (
              <div
                key={item.titulo}
                className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-600">
                    {item.titulo}
                  </p>

                  <Icone
                    className="text-green-700"
                    size={23}
                  />
                </div>

                <p className="mt-5 text-3xl font-extrabold text-[#073B2C]">
                  {item.valor}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {item.detalhe}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-9 flex flex-wrap gap-2 border-b border-green-200 pb-3">
          {[
            { id: 'resumo', nome: 'Visão geral' },
            { id: 'anuncios', nome: 'Meus anúncios' },
            { id: 'historico', nome: 'Histórico de vendas' },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAba(item.id as Aba)}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                aba === item.id
                  ? 'bg-[#073B2C] text-white'
                  : 'bg-white text-slate-600 hover:bg-green-50'
              }`}
            >
              {item.nome}
            </button>
          ))}
        </div>

        {aba === 'resumo' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Comece a vender
              </h2>

              <p className="mt-3 leading-relaxed text-slate-600">
                Escolha um lote da sua colheita, defina a
                quantidade e o preço por quilo. Depois,
                compartilhe a oferta e registre as vendas.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  ['01', 'Escolha um lote cadastrado'],
                  ['02', 'Defina quantidade e preço'],
                  ['03', 'Compartilhe seu anúncio'],
                  ['04', 'Registre a venda confirmada'],
                ].map(([numero, titulo]) => (
                  <div
                    key={numero}
                    className="flex items-center gap-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5D6] font-extrabold text-green-800">
                      {numero}
                    </span>

                    <span className="font-semibold text-slate-700">
                      {titulo}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={abrirModalAnuncio}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white hover:bg-green-800"
              >
                Criar minha oferta
                <ArrowRight size={18} />
              </button>
            </section>

            <section className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-extrabold text-[#073B2C]">
                  Estoque disponível
                </h2>

                <Package
                  size={23}
                  className="text-green-700"
                />
              </div>

              <p className="mt-2 text-slate-500">
                Quantidades reais dos seus lotes cadastrados.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F6F8F2] p-4">
                  <p className="text-xs text-slate-500">
                    Estoque físico
                  </p>

                  <p className="mt-2 text-xl font-extrabold text-[#073B2C]">
                    {peso(estoqueTotal)} kg
                  </p>
                </div>

                <div className="rounded-xl bg-[#E7F5D6] p-4">
                  <p className="text-xs text-green-800">
                    Livre para anunciar
                  </p>

                  <p className="mt-2 text-xl font-extrabold text-green-900">
                    {peso(estoqueLivreTotal)} kg
                  </p>
                </div>
              </div>

              {lotesValidos.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-green-200 p-7 text-center">
                  <Sprout
                    size={38}
                    className="mx-auto text-green-700"
                  />

                  <h3 className="mt-3 font-bold text-[#073B2C]">
                    Você ainda não cadastrou colheitas
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Cadastre seus primeiros lotes para
                    começar a anunciar.
                  </p>

                  <Link
                    to="/colheitas/nova"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#073B2C] px-5 py-3 font-bold text-white"
                  >
                    <Plus size={18} />
                    Cadastrar colheita
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {lotesValidos.map(lote => (
                    <div
                      key={lote.id}
                      className="rounded-xl bg-[#F6F8F2] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {lote.emoji ||
                              emojiProduto(lote.produto)}
                          </span>

                          <div>
                            <p className="font-bold text-[#073B2C]">
                              {lote.produto}
                            </p>

                            <p className="text-xs text-slate-500">
                              Lote {lote.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-green-800">
                          {peso(estoqueLivreLote(lote))} kg
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>
                          Físico: {peso(estoqueFisicoLote(lote))} kg
                        </span>

                        <span>
                          Reservado: {peso(
                            quantidadeReservadaLote(lote.id)
                          )} kg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {aba === 'anuncios' && (
          <section className="mt-8 rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#073B2C]">
                  Meus anúncios
                </h2>

                <p className="mt-2 text-slate-500">
                  Gerencie suas ofertas e registre as vendas.
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
                <Search
                  size={18}
                  className="text-slate-400"
                />

                <input
                  value={busca}
                  onChange={evento =>
                    setBusca(evento.target.value)
                  }
                  placeholder="Buscar produto..."
                  aria-label="Buscar anúncios"
                  className="bg-transparent text-sm outline-none"
                />
              </label>
            </div>

            {anunciosFiltrados.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBasket
                  size={44}
                  className="mx-auto text-green-600"
                />

                <h3 className="mt-4 text-xl font-bold text-[#073B2C]">
                  Nenhum anúncio encontrado
                </h3>

                <p className="mt-2 text-slate-500">
                  Crie uma oferta para começar a vender.
                </p>

                <button
                  type="button"
                  onClick={abrirModalAnuncio}
                  className="mt-6 rounded-xl bg-[#073B2C] px-6 py-3 font-bold text-white"
                >
                  Criar anúncio
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {anunciosFiltrados.map(anuncio => {
                  const restante =
                    disponibilidadeVenda(anuncio)

                  const ativo =
                    anuncio.status === 'Ativo' &&
                    restante > 0

                  const antigo = !anuncio.loteId

                  return (
                    <article
                      key={anuncio.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-start justify-between">
                        <span className="rounded-xl bg-green-50 p-3 text-3xl">
                          {emojiProduto(anuncio.produto)}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ativo ? 'Ativo' : 'Encerrado'}
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-extrabold text-[#073B2C]">
                        {anuncio.produto}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Criado em {anuncio.data}
                      </p>

                      {anuncio.loteId && (
                        <p className="mt-1 text-xs text-slate-500">
                          Lote {anuncio.loteId.slice(0, 8)}
                        </p>
                      )}

                      {antigo && (
                        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                          Anúncio antigo sem lote vinculado.
                          Crie um novo anúncio para utilizar
                          o estoque cadastrado.
                        </p>
                      )}

                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Quantidade anunciada
                          </span>

                          <strong>
                            {peso(anuncio.quantidade)} kg
                          </strong>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Disponível
                          </span>

                          <strong>
                            {peso(restante)} kg
                          </strong>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">
                            Preço por kg
                          </span>

                          <strong>
                            {moeda(anuncio.preco)}
                          </strong>
                        </div>
                      </div>

                      {ativo && (
                        <div className="mt-6 grid gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              compartilhar(anuncio)
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#E7F5D6] px-4 py-3 font-bold text-green-900"
                          >
                            <MessageCircle size={18} />
                            Compartilhar
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setErro('')
                              setQuantidadeVenda('')
                              setComprador('')
                              setModalVenda(anuncio.id)
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-4 py-3 font-bold text-white"
                          >
                            <CheckCircle2 size={18} />
                            Registrar venda
                          </button>
                        </div>
                      )}

                      {anuncio.status === 'Ativo' && (
                        <button
                          type="button"
                          onClick={() =>
                            encerrarAnuncio(anuncio.id)
                          }
                          className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                          Encerrar anúncio
                        </button>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {aba === 'historico' && (
          <section className="mt-8 rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-extrabold text-[#073B2C]">
              Histórico de vendas
            </h2>

            <p className="mt-2 text-slate-500">
              Consulte os produtos vendidos e os valores
              registrados.
            </p>

            {vendas.length === 0 ? (
              <div className="py-16 text-center">
                <ClipboardList
                  size={44}
                  className="mx-auto text-green-600"
                />

                <h3 className="mt-4 text-xl font-bold text-[#073B2C]">
                  Nenhuma venda registrada
                </h3>

                <p className="mt-2 text-slate-500">
                  Suas vendas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="mt-7 space-y-3">
                {vendas.map(venda => (
                  <div
                    key={venda.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <span className="rounded-xl bg-green-50 p-3 text-2xl">
                        {emojiProduto(venda.produto)}
                      </span>

                      <div>
                        <h3 className="font-bold text-[#073B2C]">
                          {venda.produto}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {venda.comprador} • {venda.data}
                        </p>

                        <p className="text-sm text-slate-500">
                          {peso(venda.quantidade)} kg ×{' '}
                          {moeda(venda.preco)}
                        </p>

                        {venda.loteId && (
                          <p className="mt-1 text-xs text-slate-400">
                            Lote {venda.loteId.slice(0, 8)}
                          </p>
                        )}
                      </div>
                    </div>

                    <strong className="text-xl text-green-800">
                      {moeda(
                        venda.quantidade * venda.preco
                      )}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-10 flex flex-col justify-between gap-5 rounded-3xl bg-[#E7F5D6] p-7 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-extrabold text-[#073B2C]">
              Acompanhe seu dinheiro
            </h2>

            <p className="mt-2 text-slate-700">
              Veja suas receitas e organize suas finanças.
            </p>
          </div>

          <Link
            to="/financeiro"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white"
          >
            Abrir Carteira
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>

      {modalAnuncio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={criarAnuncio}
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Novo anúncio
              </h2>

              <button
                type="button"
                aria-label="Fechar"
                onClick={fecharModalAnuncio}
              >
                <X size={24} />
              </button>
            </div>

            <p className="mt-2 text-slate-500">
              Escolha um lote da sua colheita para anunciar.
            </p>

            {lotesComEstoque.length === 0 ? (
              <div className="mt-7">
                <div className="rounded-xl bg-amber-50 p-5 text-sm text-amber-900">
                  Não há lotes com quantidade livre para
                  novos anúncios.
                </div>

                <Link
                  to="/colheitas/nova"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white"
                >
                  <Plus size={18} />
                  Cadastrar colheita
                </Link>
              </div>
            ) : (
              <div className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="lote"
                    className="mb-2 block font-semibold"
                  >
                    Lote da colheita
                  </label>

                  <select
                    id="lote"
                    required
                    value={loteSelecionadoId}
                    onChange={evento => {
                      setLoteSelecionadoId(
                        evento.target.value
                      )
                      setErro('')
                    }}
                    className="w-full rounded-xl border border-slate-200 p-4"
                  >
                    <option value="">
                      Selecione um lote
                    </option>

                    {lotesComEstoque.map(lote => (
                      <option
                        key={lote.id}
                        value={lote.id}
                      >
                        {lote.produto} — Lote{' '}
                        {lote.id.slice(0, 8)} —{' '}
                        {peso(estoqueLivreLote(lote))} kg
                      </option>
                    ))}
                  </select>

                  {loteSelecionado && (
                    <div className="mt-3 rounded-xl bg-[#E7F5D6] p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {loteSelecionado.emoji ||
                            emojiProduto(
                              loteSelecionado.produto
                            )}
                        </span>

                        <div>
                          <p className="font-bold text-[#073B2C]">
                            {loteSelecionado.produto}
                          </p>

                          <p className="text-sm text-green-800">
                            {peso(
                              estoqueLivreLote(
                                loteSelecionado
                              )
                            )}{' '}
                            kg livres para anunciar
                          </p>
                        </div>
                      </div>

                      {loteSelecionado.status && (
                        <p className="mt-3 text-xs text-green-900">
                          Situação do lote:{' '}
                          {loteSelecionado.status}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quantidade"
                    className="mb-2 block font-semibold"
                  >
                    Quantidade para anunciar (kg)
                  </label>

                  <input
                    id="quantidade"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={quantidade}
                    onChange={evento =>
                      setQuantidade(evento.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 p-4"
                    placeholder="Ex.: 10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preco"
                    className="mb-2 block font-semibold"
                  >
                    Preço por kg (R$)
                  </label>

                  <input
                    id="preco"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={preco}
                    onChange={evento =>
                      setPreco(evento.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 p-4"
                    placeholder="Ex.: 6.50"
                  />
                </div>

                {erro && (
                  <p
                    role="alert"
                    className="text-sm text-red-600"
                  >
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white"
                >
                  Publicar anúncio
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {anuncioSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <form
            onSubmit={registrarVenda}
            className="my-auto w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Registrar venda
              </h2>

              <button
                type="button"
                aria-label="Fechar"
                onClick={fecharModalVenda}
              >
                <X size={24} />
              </button>
            </div>

            <p className="mt-3 text-slate-600">
              {anuncioSelecionado.produto} •{' '}
              {moeda(anuncioSelecionado.preco)}/kg
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="comprador"
                  className="mb-2 block font-semibold"
                >
                  Nome do comprador
                </label>

                <input
                  id="comprador"
                  value={comprador}
                  onChange={evento =>
                    setComprador(evento.target.value)
                  }
                  required
                  maxLength={80}
                  className="w-full rounded-xl border border-slate-200 p-4"
                  placeholder="Ex.: Mercado Central"
                />
              </div>

              <div>
                <label
                  htmlFor="qtdVenda"
                  className="mb-2 block font-semibold"
                >
                  Quantidade vendida (kg)
                </label>

                <input
                  id="qtdVenda"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={quantidadeVenda}
                  onChange={evento =>
                    setQuantidadeVenda(
                      evento.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 p-4"
                />

                <p className="mt-2 text-sm text-slate-500">
                  Disponível neste anúncio:{' '}
                  {peso(
                    disponibilidadeVenda(
                      anuncioSelecionado
                    )
                  )}{' '}
                  kg
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-5">
                <p className="text-sm text-slate-600">
                  Total da venda
                </p>

                <p className="mt-1 text-3xl font-extrabold text-green-900">
                  {moeda(
                    Math.max(
                      0,
                      Number(quantidadeVenda) || 0
                    ) * anuncioSelecionado.preco
                  )}
                </p>
              </div>

              {erro && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {erro}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white"
              >
                Confirmar venda
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
            <Link to="/colheitas">
              Minha Colheita
            </Link>

            <Link to="/tarefas">
              O que fazer hoje?
            </Link>

            <Link to="/financeiro">
              Carteira
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-6 text-sm text-green-200">
          © 2026 ColheitaSmart. Feito para quem cultiva
          o futuro. 🌱
        </div>
      </footer>
    </main>
  )
}