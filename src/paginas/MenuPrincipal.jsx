import React from "react";
import './EstiloGeral.css';
import { Link, useNavigate } from "react-router-dom";
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const MenuPrincipal = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const navigate = useNavigate();

  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <div className='area1Menu'>
        <Link to='/geraros'>
          <button type="button" className='botao3Menu'>
            <p>
              <img src='src/imagens/gerarOS.png' />
            </p>
            Gerar O.S
          </button>
        </Link>
        <button type="button" className='botao2Menu'>
          <p>
            <img src='src/imagens/finalizarOS.png' />
          </p>
          Finalizar O.S
        </button>
      </div>
      <div className='area2Menu'>
        <button type="button" className='botao2Menu'>
          <p>
            <img src='src/imagens/servicosSolicitados.png' />
          </p>
          Serviços Solicitados
        </button>
        <button type="button" className='botao1Menu'>
          <p>
            <img src='src/imagens/servicosRealizados.png' />
          </p>
          Serviços Realizados
        </button>
      </div>
      <div className='area3Menu'>
        <Link to='/listaubs'>
          <button type="button" className='botao1Menu'>
            <p>
              <img src='src/imagens/ubs.png' />
            </p>
            UBS
          </button>
        </Link>
        <Link to='/listaterceirizadas'>
          <button type="button" className='botao2Menu'>
            <p>
              <img src='src/imagens/terceirizadas.png' />
            </p>
            Terceirizadas
          </button>
        </Link>
      </div>
      <div className='area4Menu'>
        <Link to='/listaprodutos'>
          <button type="button" className='botao1Menu'>
            <p>
              <img src='src/imagens/produtosItens.png' />
            </p>
            Produtos/Itens
          </button>
        </Link>
        <Link to='/logout'>
          <button type="button" className='botao1Menu'>
            <p>
              <img src='src/imagens/sair.png' />
            </p>
            Sair
          </button>
        </Link>
      </div>
    </>
  )
}