import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Info, Sprout, Trash2 } from 'lucide-react'

type Produto = 'Tomate' | 'Banana' | 'Alface' | 'Morango' | 'Manga' | 'Batata'
type Formulario = { produto: Produto; quantidade: string; data: string; armazenamento: string; temperatura: string }
type Lote = { id: string; produto: Produto; emoji: string; quantidade: number; data: string; armazenamento: string; temperatura: number | null; status: 'Aguardando avaliação' }

const CHAVE = 'colheitasmart_lotes'
const produtos: { nome: Produto; emoji: string }[] = [
  { nome: 'Tomate', emoji: '🍅' }, { nome: 'Banana', emoji: '🍌' },
  { nome: 'Alface', emoji: '🥬' }, { nome: 'Morango', emoji: '🍓' },
  { nome: 'Manga', emoji: '🥭' }, { nome: 'Batata', emoji: '🥔' },
]
const armazenamentos = ['Ambiente fresco', 'Local ventilado', 'Refrigeração', 'Local seco', 'Câmara fria', 'Outro']
function hojeLocal() {
  const hoje = new Date()
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
}
function lerLotes(): Lote[] {
  try {
    const salvo: unknown = JSON.parse(localStorage.getItem(CHAVE) || '[]')
    return Array.isArray(salvo) ? salvo as Lote[] : []
  } catch { return [] }
}
export default function CadastrarColheita() {
  const navigate = useNavigate()
  const [selecionados, setSelecionados] = useState<Formulario[]>([])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const campo = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100'

  function alternar(produto: Produto) {
    setErro('')
    setSelecionados(anteriores => anteriores.some(item => item.produto === produto)
      ? anteriores.filter(item => item.produto !== produto)
      : [...anteriores, { produto, quantidade: '', data: hojeLocal(), armazenamento: '', temperatura: '' }])
  }
  function atualizar(produto: Produto, campo: keyof Omit<Formulario, 'produto'>, valor: string) {
    setSelecionados(anteriores => anteriores.map(item => item.produto === produto ? { ...item, [campo]: valor } : item))
  }
  function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (salvando) return
    if (!selecionados.length) { setErro('Selecione pelo menos um alimento.'); return }
    for (const item of selecionados) {
      const quantidade = Number(item.quantidade)
      if (!Number.isFinite(quantidade) || quantidade <= 0) { setErro(`Informe uma quantidade válida para ${item.produto}.`); return }
      if (!item.data || item.data > hojeLocal()) { setErro(`Confira a data da colheita de ${item.produto}.`); return }
      if (!item.armazenamento) { setErro(`Selecione o armazenamento de ${item.produto}.`); return }
      if (item.temperatura.trim() && !Number.isFinite(Number(item.temperatura))) { setErro(`Confira a temperatura de ${item.produto}.`); return }
    }
    setSalvando(true)
    setErro('')
    const novos: Lote[] = selecionados.map(item => {
      const [ano, mes, dia] = item.data.split('-')
      return {
        id: crypto.randomUUID(), produto: item.produto,
        emoji: produtos.find(produto => produto.nome === item.produto)!.emoji,
        quantidade: Number(item.quantidade), data: `${dia}/${mes}/${ano}`,
        armazenamento: item.armazenamento,
        temperatura: item.temperatura.trim() === '' ? null : Number(item.temperatura),
        status: 'Aguardando avaliação',
      }
    })
    try {
      localStorage.setItem(CHAVE, JSON.stringify([...novos, ...lerLotes()]))
      navigate('/colheitas', { replace: true })
    } catch {
      setErro('Não foi possível salvar os lotes neste navegador. Tente novamente.')
      setSalvando(false)
    }
  }
  return (
    <main className="min-h-screen bg-[#F6F8F2]">
      <section className="bg-[#073B2C] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <Link to="/colheitas" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-[#B8F34B]"><ArrowLeft size={18} /> Voltar para Minha Colheita</Link>
          <div className="mt-8 flex items-center gap-2 text-sm font-bold text-lime-300"><Sprout size={18} /> SEU PAINEL</div>
          <h1 className="mt-4 text-4xl font-extrabold">Cadastrar colheitas</h1>
          <p className="mt-3 max-w-2xl text-green-100">Registre vários alimentos em uma única operação, com os dados de cada lote.</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3">
        <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-9 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#E7F5D6] p-3 text-green-800"><ClipboardCheck size={25} /></div>
            <div><h2 className="text-2xl font-extrabold text-[#073B2C]">Informações dos lotes</h2><p className="mt-1 text-sm text-slate-500">Selecione todos os alimentos que deseja cadastrar.</p></div>
          </div>
          <form onSubmit={salvar} className="mt-9 space-y-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-[#073B2C]">Quais alimentos você colheu?</h3><span className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-800">{selecionados.length} selecionado(s)</span></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {produtos.map(item => {
                  const marcado = selecionados.some(selecionado => selecionado.produto === item.nome)
                  return <button key={item.nome} type="button" aria-pressed={marcado} onClick={() => alternar(item.nome)} className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition ${marcado ? 'border-green-700 bg-[#E7F5D6] text-[#073B2C]' : 'border-slate-100 text-slate-600 hover:border-green-200 hover:bg-green-50'}`}><span className="text-4xl">{item.emoji}</span><span className="text-sm font-bold">{item.nome}</span>{marcado && <CheckCircle2 size={17} className="text-green-700" />}</button>
                })}
              </div>
            </div>
            {selecionados.map((item, indice) => <div key={item.produto} className="rounded-2xl border border-green-100 bg-[#FAFCF8] p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-green-700">Lote {indice + 1}</p><h3 className="mt-1 text-xl font-extrabold text-[#073B2C]">{produtos.find(produto => produto.nome === item.produto)?.emoji} {item.produto}</h3></div><button type="button" onClick={() => alternar(item.produto)} aria-label={`Remover ${item.produto}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={19} /></button></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor={`q-${item.produto}`} className="mb-2 block text-sm font-bold text-[#073B2C]">Quantidade (kg) *</label><input id={`q-${item.produto}`} className={campo} type="number" min="0.01" step="0.01" required placeholder="Ex.: 120" value={item.quantidade} onChange={e => atualizar(item.produto, 'quantidade', e.target.value)} /></div>
                <div><label htmlFor={`d-${item.produto}`} className="mb-2 block text-sm font-bold text-[#073B2C]">Data da colheita *</label><input id={`d-${item.produto}`} className={campo} type="date" max={hojeLocal()} required value={item.data} onChange={e => atualizar(item.produto, 'data', e.target.value)} /></div>
                <div><label htmlFor={`a-${item.produto}`} className="mb-2 block text-sm font-bold text-[#073B2C]">Armazenamento *</label><select id={`a-${item.produto}`} className={campo} required value={item.armazenamento} onChange={e => atualizar(item.produto, 'armazenamento', e.target.value)}><option value="">Selecione uma opção</option>{armazenamentos.map(opcao => <option key={opcao} value={opcao}>{opcao}</option>)}</select></div>
                <div><label htmlFor={`t-${item.produto}`} className="mb-2 block text-sm font-bold text-[#073B2C]">Temperatura (°C)</label><input id={`t-${item.produto}`} className={campo} type="number" step="0.1" placeholder="Ex.: 18" value={item.temperatura} onChange={e => atualizar(item.produto, 'temperatura', e.target.value)} /><p className="mt-1 text-xs text-slate-500">Opcional, caso saiba a temperatura.</p></div>
              </div>
            </div>)}
            {selecionados.length === 0 && <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/50 px-5 py-9 text-center text-slate-600"><Sprout className="mx-auto mb-3 text-green-700" size={28} />Selecione um ou mais alimentos acima para preencher seus lotes.</div>}
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><div className="flex gap-2"><Info size={20} className="shrink-0" /><p>A condição dos alimentos será avaliada pelo sistema. Até a integração da análise de risco, os lotes ficarão com a situação <strong>Aguardando avaliação</strong>.</p></div></div>
            {erro && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{erro}</p>}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end"><Link to="/colheitas" className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-4 font-bold text-slate-600 hover:bg-slate-50">Cancelar</Link><button type="submit" disabled={salvando || !selecionados.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#073B2C] px-7 py-4 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50">{salvando ? 'Salvando...' : `Cadastrar ${selecionados.length} ${selecionados.length === 1 ? 'colheita' : 'colheitas'}`}<ArrowRight size={19} /></button></div>
          </form>
        </section>
        <aside className="space-y-6"><div className="rounded-3xl bg-[#073B2C] p-7 text-white"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">🌱</div><p className="mt-7 text-xs font-bold uppercase tracking-widest text-lime-300">Resumo do cadastro</p><h2 className="mt-3 text-3xl font-extrabold">{selecionados.length} {selecionados.length === 1 ? 'lote' : 'lotes'}</h2><div className="mt-5 space-y-3">{selecionados.length ? selecionados.map(item => <div key={item.produto} className="flex justify-between gap-3 border-b border-white/15 pb-3 text-sm"><span>{produtos.find(produto => produto.nome === item.produto)?.emoji} {item.produto}</span><span className="font-bold">{item.quantidade ? `${item.quantidade} kg` : '—'}</span></div>) : <p className="text-sm text-green-100">Escolha os alimentos para começar.</p>}</div></div><div className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm"><h3 className="text-lg font-extrabold text-[#073B2C]">Uma colheita, vários lotes</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">Cada alimento terá um registro próprio. Assim você poderá acompanhar quantidades, armazenamento e avaliações individualmente.</p></div></aside>
      </div>
    </main>
  )
}