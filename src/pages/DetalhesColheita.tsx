import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, CircleAlert, ClipboardList, Package, Sprout, Thermometer, Warehouse, Scale, ArrowRight } from 'lucide-react'

type Lote = {
  id: string | number
  produto: string
  emoji?: string
  quantidade: number
  data: string
  armazenamento: string
  temperatura?: string | number | null
  status?: string
}

function encontrarLote(id: string | undefined): Lote | null {
  if (!id) return null
  try {
    const dados: unknown = JSON.parse(localStorage.getItem('colheitasmart_lotes') || '[]')
    if (!Array.isArray(dados)) return null
    const lote = dados.find(item => item && typeof item === 'object' && String((item as Lote).id) === id)
    return lote || null
  } catch { return null }
}

const numero = (valor: number) => Number(valor || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })

export default function DetalhesColheita() {
  const { id } = useParams<{ id: string }>()
  const lote = encontrarLote(id)

  if (!lote) return <main className="min-h-[75vh] bg-[#F6F8F2] px-6 py-20"><div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm"><Package size={45} className="mx-auto text-green-700" /><h1 className="mt-5 text-3xl font-extrabold text-[#073B2C]">Lote não encontrado</h1><p className="mt-3 text-slate-600">Esse lote não está disponível neste navegador.</p><Link to="/colheitas" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#073B2C] px-6 py-3 font-bold text-white"><ArrowLeft size={18} /> Voltar para Minha Colheita</Link></div></main>

  const pendente = !lote.status || lote.status === 'Aguardando avaliação'
  const nomeStatus = pendente ? 'Aguardando avaliação' : lote.status === 'Bom' ? 'Boas condições' : lote.status
  const classeStatus = pendente ? 'bg-amber-50 text-amber-800' : lote.status === 'Bom' ? 'bg-green-100 text-green-800' : lote.status === 'Alto risco' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
  const informacoes = [
    { rotulo: 'Quantidade cadastrada', valor: `${numero(Number(lote.quantidade))} kg`, icone: Scale },
    { rotulo: 'Data da colheita', valor: lote.data || 'Não informada', icone: CalendarDays },
    { rotulo: 'Armazenamento', valor: lote.armazenamento || 'Não informado', icone: Warehouse },
    { rotulo: 'Temperatura registrada', valor: lote.temperatura !== undefined && lote.temperatura !== null && lote.temperatura !== '' ? `${lote.temperatura} °C` : 'Não informada', icone: Thermometer },
  ]

  return <main className="min-h-screen bg-[#F6F8F2]">
    <section className="bg-[#073B2C] px-6 py-12 text-white"><div className="mx-auto max-w-7xl">
      <Link to="/colheitas" className="inline-flex items-center gap-2 text-sm font-semibold text-green-100 hover:text-lime-300"><ArrowLeft size={18} /> Minha Colheita</Link>
      <p className="mt-8 flex items-center gap-2 text-sm font-bold text-lime-300"><Sprout size={17} /> DETALHES DO LOTE</p>
      <div className="mt-4 flex flex-wrap items-center gap-4"><span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-5xl">{lote.emoji || '🌱'}</span><div><h1 className="text-4xl font-extrabold">{lote.produto}</h1><p className="mt-2 text-green-100">Lote #{String(lote.id).slice(0, 8).toUpperCase()}</p></div></div>
    </div></section>
    <div className="mx-auto grid max-w-7xl gap-7 px-6 py-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm md:p-9">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-green-50 p-3 text-green-800"><ClipboardList size={24} /></span><div><h2 className="text-2xl font-extrabold text-[#073B2C]">Informações da colheita</h2><p className="mt-1 text-sm text-slate-500">Dados registrados para este lote.</p></div></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">{informacoes.map(info => { const Icone = info.icone; return <div key={info.rotulo} className="rounded-2xl border border-slate-100 bg-[#F8FAF5] p-5"><div className="flex items-center gap-2 text-sm text-slate-500"><Icone size={18} className="text-green-700" /> {info.rotulo}</div><p className="mt-4 break-words text-xl font-bold text-[#073B2C]">{info.valor}</p></div> })}</div>
        <Link to="/colheitas" className="mt-8 inline-flex items-center gap-2 font-bold text-green-800 hover:text-green-600"><ArrowLeft size={18} /> Voltar aos lotes</Link>
      </section>
      <aside className="space-y-5">
        <section className="rounded-3xl border border-green-100 bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><CircleAlert size={23} className="text-green-700" /><h2 className="text-lg font-extrabold text-[#073B2C]">Situação do lote</h2></div><span className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-bold ${classeStatus}`}>{nomeStatus}</span><p className="mt-4 text-sm leading-relaxed text-slate-600">{pendente ? 'A avaliação automática ainda não foi realizada. As informações cadastradas serão utilizadas na futura análise de risco.' : 'Esta é a situação registrada para o lote. Consulte a origem e a data da avaliação quando a análise automática estiver integrada.'}</p></section>
        <section className="rounded-3xl bg-[#073B2C] p-7 text-white"><Sprout size={28} className="text-lime-300" /><h2 className="mt-5 text-xl font-extrabold">Cada lote conta.</h2><p className="mt-3 text-sm leading-relaxed text-green-100">Organizar as informações após a colheita é o primeiro passo para reduzir perdas e planejar a comercialização.</p><Link to="/colheitas/nova" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#B8F34B] px-5 py-3 font-bold text-[#073B2C]">Cadastrar outro lote <ArrowRight size={17} /></Link></section>
      </aside>
    </div>
  </main>
}
