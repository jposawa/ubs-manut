import React from 'react'
import './App.css'
import { useRecoilValue } from 'recoil'
import { usuarioLogadoAtom } from './compartilhados/estados/index.jsx'
import { RotasUrl } from './paginas/RotasUrl.jsx'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { Cabecalho } from './componentes/Cabecalho.jsx'

function App() {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const defineUsuarioLogado = useSetRecoilState(usuarioLogadoAtom);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!usuarioLogado) {
      const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
      if (!usuarioSessao) {
        navigate('/login');
      }
      else {
        defineUsuarioLogado(usuarioSessao);
      }
    }
  }, [usuarioLogado]);

  const anoAtual = new Date().getFullYear();
  return (
    <main className='containerApp'>
      <div className='message'>
        <b>
          <p>Este aplicativo funciona melhor em</p>
          <p> modo retrato (na vertical).</p>
          <p>Favor rotacionar seu aparelho.</p>
        </b>
      </div>
      <Cabecalho className='cabecalho' />
      <section className='paginaCentral'>
        <RotasUrl />
      </section>
      <footer className='rodape'>Todos os Diteitos Reservados  &copy; {anoAtual}  Eduardo</footer>
    </main>
  )
}

export default App