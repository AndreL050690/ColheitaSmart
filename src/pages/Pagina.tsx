type PaginaProps = {
  titulo: string
  descricao: string
}

export default function Pagina({ titulo, descricao }: PaginaProps) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16 min-h-[70vh]">
      <h1 className="text-4xl font-bold text-green-950">
        {titulo}
      </h1>

      <p className="text-gray-600 text-lg mt-4">
        {descricao}
      </p>
    </main>
  )
}