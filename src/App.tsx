import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import Pagina from './pages/Pagina'

const paginas = [
  { nome: 'Home', rota: '/', descricao: 'Sua colheita vale mais.' },
  { nome: 'Sobre', rota: '/sobre', descricao: 'Conheça o ColheitaSmart.' },
  { nome: 'Integrantes', rota: '/integrantes', descricao: 'Conheça nossa equipe.' },
  { nome: 'FAQ', rota: '/faq', descricao: 'Perguntas frequentes.' },
  { nome: 'Contato', rota: '/contato', descricao: 'Entre em contato.' },
  { nome: 'Minha Colheita', rota: '/colheitas', descricao: 'Gerencie seus lotes.' },
  { nome: 'O que fazer hoje?', rota: '/tarefas', descricao: 'Veja suas prioridades.' },
  { nome: 'Vender minha Colheita', rota: '/vendas', descricao: 'Simule suas vendas.' },
  { nome: 'Meu Dinheiro', rota: '/financeiro', descricao: 'Acompanhe seus resultados.' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7faf6]">
        <header className="bg-white border-b border-green-100">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center gap-2 text-green-800 font-bold text-xl mb-5">
              <Sprout size={28} />
              ColheitaSmart
            </div>

            <nav className="flex flex-wrap gap-4">
              {paginas.map((pagina) => (
                <NavLink
                  key={pagina.rota}
                  to={pagina.rota}
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? 'text-green-700 underline'
                        : 'text-gray-600 hover:text-green-700'
                    }`
                  }
                >
                  {pagina.nome}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <Routes>
          {paginas.map((pagina) => (
            <Route
              key={pagina.rota}
              path={pagina.rota}
              element={
                <Pagina
                  titulo={pagina.nome === 'Home' ? 'Sua colheita vale mais.' : pagina.nome}
                  descricao={pagina.descricao}
                />
              }
            />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  )
}