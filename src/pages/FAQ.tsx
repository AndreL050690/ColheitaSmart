import { useState } from 'react'

const perguntas = [
  {
    id: 'sobre',
    titulo: 'O que é o ColheitaSmart?',
    resposta: 'É uma aplicação web para organizar e acompanhar produtos depois da colheita.',
  },
  {
    id: 'publico',
    titulo: 'Para quem o ColheitaSmart foi pensado?',
    resposta: 'Para pequenos agricultores e produtores rurais que querem organizar melhor sua produção.',
  },
  {
    id: 'lotes',
    titulo: 'Para que serve a página Minha Colheita?',
    resposta: 'Essa área foi pensada para reunir os lotes e facilitar a consulta ao produto e à quantidade disponível.',
  },
  {
    id: 'desperdicio',
    titulo: 'Como o projeto pode ajudar a reduzir o desperdício?',
    resposta: 'Ao acompanhar os lotes, o produtor pode identificar quais alimentos precisam de atenção primeiro e planejar o destino deles.',
  },
  {
    id: 'tarefas',
    titulo: 'O que vou encontrar na área de Tarefas?',
    resposta: 'A proposta dessa área é ajudar o produtor a organizar as ações do dia e priorizar os lotes que precisam de atenção.',
  },
  {
    id: 'vendas',
    titulo: 'Para que serve a área de Vendas?',
    resposta: 'Essa área foi pensada para apoiar o planejamento das vendas, com simulação de valores e preparação de ofertas.',
  },
  {
    id: 'carteira',
    titulo: 'O que é a Carteira?',
    resposta: 'É a área destinada ao acompanhamento financeiro da produção, que ainda está em desenvolvimento.',
  },
  {
    id: 'demonstracao',
    titulo: 'Os dados da página inicial são reais?',
    resposta: 'Os dados da página inicial são exemplos que demonstram como a aplicação pode apresentar as informações da colheita.',
  },
]

export default function FAQ() {
  const [perguntaAberta, setPerguntaAberta] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-green-50 px-6 py-16 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <span className="font-semibold text-green-700">
            CENTRAL DE AJUDA
          </span>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Perguntas Frequentes
          </h1>

          <p className="mt-5 text-slate-600">
            Encontre respostas sobre o ColheitaSmart.
          </p>
        </header>

        <section className="mt-12 space-y-4" aria-label="Perguntas e respostas">
          {perguntas.map((pergunta) => {
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