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

  return (
    <main className="min-h-screen bg-green-50 px-6 py-16 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <span className="font-semibold text-green-700">CENTRAL DE AJUDA</span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Perguntas Frequentes
          </h1>
          <p className="mt-5 text-slate-600">
            Encontre respostas sobre o ColheitaSmart.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="grid gap-2 font-medium">
            Buscar na FAQ
            <input
              type="search"
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value)
                setPerguntaAberta(null)
              }}
              placeholder="Ex.: colheita ou carteira"
              className="w-full rounded-lg border border-green-200 bg-white px-4 py-3"
            />
          </label>

          <label className="grid gap-2 font-medium">
            Categoria
            <select
              value={categoria}
              onChange={(event) => {
                setCategoria(event.target.value)
                setPerguntaAberta(null)
              }}
              className="w-full rounded-lg border border-green-200 bg-white px-4 py-3"
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

        <p className="mt-4 text-sm text-slate-600">
          {perguntasFiltradas.length === 0
            ? 'Nenhuma pergunta encontrada. Tente outro termo ou categoria.'
            : `${perguntasFiltradas.length} de ${perguntas.length} perguntas`}
        </p>

        <section className="mt-6 space-y-4" aria-label="Perguntas e respostas">
          {perguntasFiltradas.map((pergunta) => {
            const aberta = perguntaAberta === pergunta.id
            const idResposta = `faq-resposta-${pergunta.id}`

            return (
              <article
                key={pergunta.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <h2>
                  <button
                    type="button"
                    aria-expanded={aberta}
                    aria-controls={idResposta}
                    className="flex w-full items-center justify-between gap-4 text-left text-lg font-semibold"
                    onClick={() => setPerguntaAberta(aberta ? null : pergunta.id)}
                  >
                    <span>{pergunta.titulo}</span>
                    <span aria-hidden="true">{aberta ? '−' : '+'}</span>
                  </button>
                </h2>
                <p
                  id={idResposta}
                  hidden={!aberta}
                  className="mt-3 text-slate-600"
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