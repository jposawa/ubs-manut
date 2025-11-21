import React from 'react'
import './App.css'
import { useRecoilValue } from 'recoil'
import { usuarioLogadoAtom } from './compartilhados/estados'
import { RotasUrl } from './paginas/RotasUrl.jsx'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { Cabecalho } from './componentes/Cabecalho.jsx'

/*
Tabela referente NIVEL DE ACESSO 

NIVEL   ROTINAS / AUTORIZADO
10      Acesso Geral (Tudo)
 9      Gestor das UBS"s - Nao gerencia as Terceirizadas
 8
 7
 6
 5      Gerente de Terceirizadas - Tudo a respeito da Empresa 
 4      Gerencia as O.S da Terceirizada, caso autorizado pelo gerente, no ato do cadastro (pelo Gerente)
 3      
 2
 1
 0
*/

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
      <footer className='rodape'>Todos os Direitos Reservados  &copy; {anoAtual}  Eduardo</footer>
    </main>
  )
}

export default App