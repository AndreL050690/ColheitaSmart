export default function Sobre() {
  return (
    <main className="min-h-screen bg-green-50 text-slate-800">
      <section className="bg-green-800 px-6 py-20 text-center text-white">
        <span className="text-sm font-semibold">
          🌱 CONHEÇA NOSSO PROJETO
        </span>

        <h1 className="mt-5 text-4xl font-bold md:text-5xl">
          Sobre o ColheitaSmart
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-green-100">
          Tecnologia para ajudar pequenos agricultores
          a cuidar melhor de seus alimentos depois da colheita.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-bold">
          Nossa missão
        </h2>

        <p className="mt-5 leading-8 text-slate-600">
          Facilitar o acompanhamento das colheitas,
          organizar informações e apoiar a comercialização
          de alimentos.
        </p>
      </section>
    </main>
  );
}