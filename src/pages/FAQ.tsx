import { useState } from 'react'

const perguntas = [
  {
    id: 'sobre',
    categoria: 'Sobre o projeto',
    titulo: 'O que é o ColheitaSmart?',
    resposta: 'É uma aplicação web para organizar e acompanhar produtos depois da colheita.',
  },
  {
    id: 'publico',
    categoria: 'Sobre o projeto',
    titulo: 'Para quem o ColheitaSmart foi pensado?',
    resposta: 'Para pequenos agricultores e produtores rurais que querem organizar melhor sua produção.',
  },
  {
    id: 'lotes',
    categoria: 'Colheitas',
    titulo: 'Para que serve a página Minha Colheita?',
    resposta: 'Essa área foi pensada para reunir os lotes e facilitar a consulta ao produto e à quantidade disponível.',
  },
  {
    id: 'desperdicio',
    categoria: 'Colheitas',
    titulo: 'Como o projeto pode ajudar a reduzir o desperdício?',
    resposta: 'Ao acompanhar os lotes, o produtor pode identificar quais alimentos precisam de atenção primeiro e planejar o destino deles.',
  },
  {
    id: 'tarefas',
    categoria: 'Colheitas',
    titulo: 'O que vou encontrar na área de Tarefas?',
    resposta: 'A proposta dessa área é ajudar o produtor a organizar as ações do dia e priorizar os lotes que precisam de atenção.',
  },
  {
    id: 'vendas',
    categoria: 'Vendas e finanças',
    titulo: 'Para que serve a área de Vendas?',
    resposta: 'Essa área foi pensada para apoiar o planejamento das vendas, com simulação de valores e preparação de ofertas.',
  },
  {
    id: 'carteira',
    categoria: 'Vendas e finanças',
    titulo: 'O que é a Carteira?',
    resposta: 'É a área destinada ao acompanhamento financeiro da produção, que ainda está em desenvolvimento.',
  },
  {
    id: 'demonstracao',
    categoria: 'Sobre o projeto',
    titulo: 'Os dados da página inicial são reais?',
    resposta: 'Os dados da página inicial são exemplos que demonstram como a aplicação pode apresentar as informações da colheita.',
  },
]

const categorias = [...new Set(perguntas.map((pergunta) => pergunta.categoria))]

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}


export default function FAQ() {
  const [perguntaAberta, setPerguntaAberta] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')

  const termo = normalizarTexto(busca)
  const perguntasFiltradas = perguntas.filter((pergunta) => {
    const correspondeCategoria = categoria === '' || pergunta.categoria === categoria
    const texto = normalizarTexto(`${pergunta.titulo} ${pergunta.resposta}`)

    return correspondeCategoria && texto.includes(termo)
  })

  const estiloCampo =
    'min-w-0 w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700'

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10 text-slate-800 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <span className="text-sm font-semibold tracking-wide text-green-800">
            CENTRAL DE AJUDA
          </span>
          <h1 className="mt-3 text-3xl font-bold text-green-950 sm:text-4xl md:text-5xl">
            Perguntas Frequentes
          </h1>
          <p className="mt-4 text-slate-600">
            Encontre respostas sobre o ColheitaSmart.
          </p>
        </header>

        <div className="mt-8 grid gap-4 rounded-2xl border border-green-100 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6">
          <label className="grid min-w-0 gap-2 font-medium text-green-950">
            Buscar na FAQ
            <input
              type="search"
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value)
                setPerguntaAberta(null)
              }}
              placeholder="Ex.: colheita ou carteira"
              className={estiloCampo}
            />
          </label>

          <label className="grid min-w-0 gap-2 font-medium text-green-950">
            Categoria
            <select
              value={categoria}
              onChange={(event) => {
                setCategoria(event.target.value)
                setPerguntaAberta(null)
              }}
              className={estiloCampo}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p role="status" className="mt-4 text-sm text-slate-600">
          {perguntasFiltradas.length === 0
            ? 'Nenhuma pergunta encontrada. Tente outro termo ou categoria.'
            : `${perguntasFiltradas.length} de ${perguntas.length} perguntas`}
        </p>

        <section className="mt-4 space-y-3" aria-label="Perguntas e respostas">
          {perguntasFiltradas.map((pergunta) => {
            const aberta = perguntaAberta === pergunta.id
            const idResposta = `faq-resposta-${pergunta.id}`

            return (
              <article
                key={pergunta.id}
                className="rounded-2xl border border-green-100 bg-white shadow-sm"
              >
                <h2>
                  <button
                    type="button"
                    aria-expanded={aberta}
                    aria-controls={idResposta}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left text-base font-semibold text-green-950 hover:bg-green-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-700 sm:px-6 sm:text-lg"
                    onClick={() => setPerguntaAberta(aberta ? null : pergunta.id)}
                  >
                    <span>{pergunta.titulo}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl text-green-700"
                    >
                      {aberta ? '−' : '+'}
                    </span>
                  </button>
                </h2>

                <p
                  id={idResposta}
                  hidden={!aberta}
                  className="px-4 pb-5 leading-relaxed text-slate-600 sm:px-6"
                >
                  {pergunta.resposta}
                </p>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}