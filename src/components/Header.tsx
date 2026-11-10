
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Sprout, Menu, X, ArrowUpRight,
  House
} from 'lucide-react'

const linksInstitucionais = [
  { nome: 'Início', rota: '/' },
  { nome: 'Sobre', rota: '/sobre' },
  { nome: 'Integrantes', rota: '/integrantes' },
  { nome: 'FAQ', rota: '/faq' },
  { nome: 'Contato', rota: '/contato' },
]

const linksPainel = [
  { nome: 'Minha Colheita', rota: '/colheitas' },
  { nome: 'O que fazer hoje?', rota: '/tarefas' },
  { nome: 'Vender Colheita', rota: '/vendas' },
  { nome: 'Carteira', rota: '/financeiro' },
]

export default function Header() {
  const [aberto, setAberto] = useState(false)
  const { pathname } = useLocation()

  const estaNoPainel = linksPainel.some(
    link =>
      pathname === link.rota ||
      pathname.startsWith(`${link.rota}/`)
  )

  const navegacao = estaNoPainel
    ? linksPainel
    : linksInstitucionais

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to="/"
          onClick={() => setAberto(false)}
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-[#073B2C]"
        >
          <span className="rounded-xl bg-[#073B2C] p-2 text-[#B8F34B]">
            <Sprout size={24} />
          </span>
          ColheitaSmart
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {navegacao.map(link => (
            <NavLink
              key={link.rota}
              to={link.rota}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-green-700 ${
                  isActive ? 'text-green-700' : 'text-slate-600'
                }`
              }
            >
              {link.nome}
            </NavLink>
          ))}
        </nav>

        {!estaNoPainel ? (
          <Link
            to="/colheitas"
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#073B2C] px-5 py-3 text-sm font-bold text-white hover:bg-green-800 sm:inline-flex"
          >
            Acessar painel <ArrowUpRight size={18} />
          </Link>
        ) : (
          <Link
            to="/"
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-green-200 px-4 py-3 text-sm font-semibold text-[#073B2C] hover:bg-green-50 xl:inline-flex"
          >
            <House size={17} /> Início
          </Link>
        )}

        <button
          type="button"
          className="rounded-lg p-2 text-green-950 lg:hidden"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? <X /> : <Menu />}
        </button>
      </div>

      {aberto && (
        <nav className="border-t border-green-100 bg-white px-6 py-4 lg:hidden">
          {navegacao.map(link => (
            <NavLink
              key={link.rota}
              to={link.rota}
              onClick={() => setAberto(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 font-semibold ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-green-950 hover:bg-green-50'
                }`
              }
            >
              {link.nome}
            </NavLink>
          ))}

          <Link
            to={estaNoPainel ? '/' : '/colheitas'}
            onClick={() => setAberto(false)}
            className="mt-3 block rounded-lg bg-[#073B2C] px-4 py-3 text-center font-bold text-white"
          >
            {estaNoPainel ? 'Voltar ao início' : 'Acessar painel'}
          </Link>
        </nav>
      )}
    </header>
  )
}