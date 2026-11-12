export default function FAQ() {
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

        <section className="mt-12 space-y-4">
          <article className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              O que é o ColheitaSmart?
            </h2>

            <p className="mt-3 text-slate-600">
              Uma plataforma para organizar e acompanhar
              produtos depois da colheita.
            </p>
          </article>
        </section>

        {/* COMMIT 2: adicionar perguntas */}

        {/* COMMIT 3: implementar accordion com useState */}

        {/* COMMIT 4: adicionar busca e filtros */}

        {/* COMMIT 5: melhorar responsividade e acessibilidade */}
      </div>
    </main>
  );
}