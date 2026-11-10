
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Pagina from './pages/Pagina'
import MinhaColheita from './pages/MinhaColheita'
import Tarefas from './pages/Tarefas'
import Vendas from './pages/Vendas'

const paginas = [
  { nome: 'Sobre', rota: '/sobre', descricao: 'Conheça o ColheitaSmart.' },
  { nome: 'Integrantes', rota: '/integrantes', descricao: 'Conheça nossa equipe.' },
  { nome: 'FAQ', rota: '/faq', descricao: 'Perguntas frequentes.' },
  { nome: 'Contato', rota: '/contato', descricao: 'Entre em contato.' },
  { nome: 'Carteira', rota: '/financeiro', descricao: 'Acompanhe suas finanças.' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F6F8F2]">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colheitas" element={<MinhaColheita />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/vendas" element={<Vendas />} />

          {paginas.map(pagina => (
            <Route
              key={pagina.rota}
              path={pagina.rota}
              element={
                <Pagina
                  titulo={pagina.nome}
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