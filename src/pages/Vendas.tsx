
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout, Plus, ShoppingBasket,
  CheckCircle2, Wallet,
  MessageCircle, Trash2, X, Search,
  ArrowRight, ClipboardList
} from 'lucide-react'

type Anuncio = {
  id: string
  produto: string
  quantidade: number
  preco: number
  data: string
  status: 'Ativo' | 'Encerrado'
}

type Venda = {
  id: string
  anuncioId: string
  produto: string
  quantidade: number
  preco: number
  comprador: string
  data: string
}

const produtos = [
  { nome: 'Tomate', emoji: '🍅', estoque: 120 },
  { nome: 'Banana', emoji: '🍌', estoque: 180 },
  { nome: 'Alface', emoji: '🥬', estoque: 40 },
  { nome: 'Morango', emoji: '🍓', estoque: 25 },
  { nome: 'Manga', emoji: '🥭', estoque: 75 },
  { nome: 'Batata', emoji: '🥔', estoque: 100 },
]

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

function carregar<T>(chave: string): T[] {
  try {
    const dados = localStorage.getItem(chave)
    return dados ? JSON.parse(dados) as T[] : []
  } catch {
    return []
  }
}

function gerarId() {
  return crypto.randomUUID()
}

export default function Vendas() {
  const [aba, setAba] = useState<'resumo' | 'anuncios' | 'historico'>('resumo')
  const [anuncios, setAnuncios] = useState<Anuncio[]>(() =>
    carregar<Anuncio>('colheitasmart_anuncios')
  )
  const [vendas, setVendas] = useState<Venda[]>(() =>
    carregar<Venda>('colheitasmart_vendas')
  )

  const [modalAnuncio, setModalAnuncio] = useState(false)
  const [modalVenda, setModalVenda] = useState<string | null>(null)

  const [produto, setProduto] = useState('Tomate')
  const [quantidade, setQuantidade] = useState('')
  const [preco, setPreco] = useState('')
  const [quantidadeVenda, setQuantidadeVenda] = useState('')
  const [comprador, setComprador] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    localStorage.setItem('colheitasmart_anuncios', JSON.stringify(anuncios))
  }, [anuncios])

  useEffect(() => {
    localStorage.setItem('colheitasmart_vendas', JSON.stringify(vendas))
  }, [vendas])

  const estoqueRestante = (nome: string) => {
    const inicial = produtos.find(p => p.nome === nome)?.estoque ?? 0
    const vendido = vendas
      .filter(v => v.produto === nome)
      .reduce((total, v) => total + v.quantidade, 0)
    return Math.max(0, inicial - vendido)
  }

  const anunciosAtivos = anuncios.filter(a => a.status === 'Ativo')
  const receitaTotal = vendas.reduce(
    (total, venda) => total + venda.quantidade * venda.preco, 0
  )
  const pesoVendido = vendas.reduce(
    (total, venda) => total + venda.quantidade, 0
  )

  const anunciosFiltrados = useMemo(
    () => anuncios.filter(a =>
      a.produto.toLowerCase().includes(busca.toLowerCase())
    ),
    [anuncios, busca]
  )

  const anuncioSelecionado = anuncios.find(a => a.id === modalVenda)

  function quantidadeDisponivelAnuncio(anuncio: Anuncio) {
    const vendido = vendas
      .filter(v => v.anuncioId === anuncio.id)
      .reduce((total, v) => total + v.quantidade, 0)
    return Math.max(0, anuncio.quantidade - vendido)
  }

  function criarAnuncio(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const qtd = Number(quantidade)
    const valor = Number(preco)

    if (
      !Number.isFinite(qtd) || !Number.isFinite(valor) ||
      qtd <= 0 || valor <= 0 || qtd > estoqueRestante(produto)
    ) {
      setErro('Confira a quantidade disponível e informe um preço válido.')
      return
    }

    const novo: Anuncio = {
      id: gerarId(),
      produto,
      quantidade: qtd,
      preco: valor,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'Ativo',
    }

    setAnuncios(anteriores => [novo, ...anteriores])
    setQuantidade('')
    setPreco('')
    setErro('')
    setModalAnuncio(false)
    setAba('anuncios')
  }

  function registrarVenda(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!anuncioSelecionado) return

    const qtd = Number(quantidadeVenda)
    const disponivel = Math.min(
      quantidadeDisponivelAnuncio(anuncioSelecionado),
      estoqueRestante(anuncioSelecionado.produto)
    )

    if (!Number.isFinite(qtd) || qtd <= 0 || qtd > disponivel) {
      setErro('Informe uma quantidade válida dentro do estoque disponível.')
      return
    }

    if (!comprador.trim()) {
      setErro('Informe o nome do comprador.')
      return
    }

    const novaVenda: Venda = {
      id: gerarId(),
      anuncioId: anuncioSelecionado.id,
      produto: anuncioSelecionado.produto,
      quantidade: qtd,
      preco: anuncioSelecionado.preco,
      comprador: comprador.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
    }

    setVendas(anteriores => [novaVenda, ...anteriores])

    if (qtd >= quantidadeDisponivelAnuncio(anuncioSelecionado)) {
      setAnuncios(anteriores => anteriores.map(a =>
        a.id === anuncioSelecionado.id
          ? { ...a, status: 'Encerrado' }
          : a
      ))
    }

    setModalVenda(null)
    setQuantidadeVenda('')
    setComprador('')
    setErro('')
    setAba('historico')
  }

  function compartilhar(anuncio: Anuncio) {
    const qtd = Math.min(
      quantidadeDisponivelAnuncio(anuncio),
      estoqueRestante(anuncio.produto)
    )

    const mensagem = [
      '🌱 *COLHEITASMART — COLHEITA À VENDA*',
      '',
      `🥬 Produto: ${anuncio.produto}`,
      `📦 Quantidade disponível: ${qtd} kg`,
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

  function encerrarAnuncio(id: string) {
    setAnuncios(anteriores => anteriores.map(a =>
      a.id === id ? { ...a, status: 'Encerrado' } : a
    ))
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
      detalhe: `${pesoVendido} kg vendidos`,
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
              <Sprout size={18} /> SEU PAINEL
            </span>
            <h1 className="mt-4 text-4xl font-extrabold">
              Vender Colheita
            </h1>
            <p className="mt-3 max-w-xl text-green-100">
              Anuncie seus produtos, registre vendas e acompanhe
              suas negociações em um só lugar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setErro('')
              setModalAnuncio(true)
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8F34B] px-6 py-4 font-bold text-[#073B2C] hover:bg-lime-200"
          >
            <Plus size={20} /> Criar anúncio
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {cartoes.map(item => {
            const Icone = item.icone
            return (
              <div key={item.titulo} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-600">{item.titulo}</p>
                  <Icone className="text-green-700" size={23} />
                </div>
                <p className="mt-5 text-3xl font-extrabold text-[#073B2C]">
                  {item.valor}
                </p>
                <p className="mt-2 text-sm text-slate-500">{item.detalhe}</p>
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
              onClick={() => setAba(item.id as typeof aba)}
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
                Crie um anúncio com o alimento, a quantidade e o preço.
                Depois, compartilhe com seus compradores e registre
                as vendas realizadas.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  ['01', 'Escolha o produto'],
                  ['02', 'Defina quantidade e preço'],
                  ['03', 'Compartilhe seu anúncio'],
                  ['04', 'Registre a venda confirmada'],
                ].map(([numero, titulo]) => (
                  <div key={numero} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F5D6] font-extrabold text-green-800">
                      {numero}
                    </span>
                    <span className="font-semibold text-slate-700">{titulo}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setModalAnuncio(true)}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white hover:bg-green-800"
              >
                Criar minha oferta <ArrowRight size={18} />
              </button>
            </section>

            <section className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Estoque disponível
              </h2>
              <p className="mt-2 text-slate-500">
                Quantidades disponíveis para novas vendas.
              </p>

              <div className="mt-6 space-y-3">
                {produtos.map(item => (
                  <div
                    key={item.nome}
                    className="flex items-center justify-between rounded-xl bg-[#F6F8F2] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-bold text-[#073B2C]">{item.nome}</span>
                    </div>
                    <span className="font-semibold text-green-800">
                      {estoqueRestante(item.nome)} kg
                    </span>
                  </div>
                ))}
              </div>
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
                <Search size={18} className="text-slate-400" />
                <input
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  placeholder="Buscar produto..."
                  aria-label="Buscar anúncios"
                  className="bg-transparent text-sm outline-none"
                />
              </label>
            </div>

            {anunciosFiltrados.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBasket size={44} className="mx-auto text-green-600" />
                <h3 className="mt-4 text-xl font-bold text-[#073B2C]">
                  Nenhum anúncio encontrado
                </h3>
                <p className="mt-2 text-slate-500">
                  Crie uma oferta para começar a vender.
                </p>
                <button
                  onClick={() => setModalAnuncio(true)}
                  className="mt-6 rounded-xl bg-[#073B2C] px-6 py-3 font-bold text-white"
                >
                  Criar anúncio
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {anunciosFiltrados.map(anuncio => {
                  const restante = Math.min(
                    quantidadeDisponivelAnuncio(anuncio),
                    estoqueRestante(anuncio.produto)
                  )
                  const ativo = anuncio.status === 'Ativo' && restante > 0
                  const emoji = produtos.find(p => p.nome === anuncio.produto)?.emoji

                  return (
                    <article key={anuncio.id} className="rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between">
                        <span className="rounded-xl bg-green-50 p-3 text-3xl">
                          {emoji}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ativo ? 'Ativo' : 'Encerrado'}
                        </span>
                      </div>

                      <h3 className="mt-5 text-xl font-extrabold text-[#073B2C]">
                        {anuncio.produto}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Criado em {anuncio.data}
                      </p>

                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Quantidade anunciada</span>
                          <strong>{anuncio.quantidade} kg</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Disponível</span>
                          <strong>{restante} kg</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Preço por kg</span>
                          <strong>{moeda(anuncio.preco)}</strong>
                        </div>
                      </div>

                      {ativo && (
                        <div className="mt-6 grid gap-2">
                          <button
                            onClick={() => compartilhar(anuncio)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#E7F5D6] px-4 py-3 font-bold text-green-900"
                          >
                            <MessageCircle size={18} /> Compartilhar
                          </button>
                          <button
                            onClick={() => {
                              setErro('')
                              setModalVenda(anuncio.id)
                            }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-4 py-3 font-bold text-white"
                          >
                            <CheckCircle2 size={18} /> Registrar venda
                          </button>
                          <button
                            onClick={() => encerrarAnuncio(anuncio.id)}
                            className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-red-600"
                          >
                            <Trash2 size={16} /> Encerrar anúncio
                          </button>
                        </div>
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
              Consulte os produtos vendidos e os valores registrados.
            </p>

            {vendas.length === 0 ? (
              <div className="py-16 text-center">
                <ClipboardList size={44} className="mx-auto text-green-600" />
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
                        {produtos.find(p => p.nome === venda.produto)?.emoji}
                      </span>
                      <div>
                        <h3 className="font-bold text-[#073B2C]">
                          {venda.produto}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {venda.comprador} • {venda.data}
                        </p>
                        <p className="text-sm text-slate-500">
                          {venda.quantidade} kg × {moeda(venda.preco)}
                        </p>
                      </div>
                    </div>
                    <strong className="text-xl text-green-800">
                      {moeda(venda.quantidade * venda.preco)}
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
            Abrir Carteira <ArrowRight size={18} />
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
              <button type="button" aria-label="Fechar" onClick={() => setModalAnuncio(false)}>
                <X size={24} />
              </button>
            </div>

            <p className="mt-2 text-slate-500">
              Preencha os dados do produto que deseja vender.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label htmlFor="produto" className="mb-2 block font-semibold">
                  Produto
                </label>
                <select
                  id="produto"
                  value={produto}
                  onChange={e => setProduto(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-4"
                >
                  {produtos.map(p => (
                    <option key={p.nome} value={p.nome}>
                      {p.emoji} {p.nome}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-green-700">
                  Disponível: {estoqueRestante(produto)} kg
                </p>
              </div>

              <div>
                <label htmlFor="quantidade" className="mb-2 block font-semibold">
                  Quantidade (kg)
                </label>
                <input
                  id="quantidade"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={quantidade}
                  onChange={e => setQuantidade(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-4"
                  placeholder="Ex.: 20"
                />
              </div>

              <div>
                <label htmlFor="preco" className="mb-2 block font-semibold">
                  Preço por kg (R$)
                </label>
                <input
                  id="preco"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={preco}
                  onChange={e => setPreco(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-4"
                  placeholder="Ex.: 6.50"
                />
              </div>

              {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#073B2C] px-6 py-4 font-bold text-white"
              >
                Publicar anúncio
              </button>
            </div>
          </form>
        </div>
      )}

      {anuncioSelecionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={registrarVenda}
            className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#073B2C]">
                Registrar venda
              </h2>
              <button type="button" aria-label="Fechar" onClick={() => setModalVenda(null)}>
                <X size={24} />
              </button>
            </div>

            <p className="mt-3 text-slate-600">
              {anuncioSelecionado.produto} • {moeda(anuncioSelecionado.preco)}/kg
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label htmlFor="comprador" className="mb-2 block font-semibold">
                  Nome do comprador
                </label>
                <input
                  id="comprador"
                  value={comprador}
                  onChange={e => setComprador(e.target.value)}
                  required
                  maxLength={80}
                  className="w-full rounded-xl border border-slate-200 p-4"
                  placeholder="Ex.: Mercado Central"
                />
              </div>

              <div>
                <label htmlFor="qtdVenda" className="mb-2 block font-semibold">
                  Quantidade vendida (kg)
                </label>
                <input
                  id="qtdVenda"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={quantidadeVenda}
                  onChange={e => setQuantidadeVenda(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-4"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Disponível neste anúncio: {Math.min(
                    quantidadeDisponivelAnuncio(anuncioSelecionado),
                    estoqueRestante(anuncioSelecionado.produto)
                  )} kg
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-5">
                <p className="text-sm text-slate-600">Total da venda</p>
                <p className="mt-1 text-3xl font-extrabold text-green-900">
                  {moeda(Math.max(0, Number(quantidadeVenda) || 0) * anuncioSelecionado.preco)}
                </p>
              </div>

              {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}

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
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold">
              <Sprout className="text-[#B8F34B]" /> ColheitaSmart
            </Link>
            <p className="mt-3 text-sm text-green-100">
              Tecnologia para valorizar cada colheita.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-green-100">
            <Link to="/colheitas">Minha Colheita</Link>
            <Link to="/tarefas">O que fazer hoje?</Link>
            <Link to="/financeiro">Carteira</Link>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/15 pt-6 text-sm text-green-200">
          © 2026 ColheitaSmart. Feito para quem cultiva o futuro. 🌱
        </div>
      </footer>
    </main>
  )
}
