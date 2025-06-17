import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_OS, URL_PRODUTOS, URL_TERCEIRIZADAS, URL_UBS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { dataAtual } from '../compartilhados/funcoes'
import { Select } from '@mantine/core'
import './EstiloGeral.css'

export const FecharOs = (props) => {
  
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [dadosUbs, defineDadosUbs] = React.useState([]);

  const [dadosTerceirizada, defineDadosTerceirizada] = React.useState([]);
  const navigate = useNavigate();
  const codMunic = usuarioLogado.codMunicipio;
  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/menuprincipal');
    }
    console.log('ID UBS: ' + idUbs);
    axios.get(URL_UBS, {
      params: {
        opc: 'buscaDadosUbs',
        idUbs: idUbs,
        codMunicipio: codMunic
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      console.log(response.data);
      defineDadosUbs(response.data);
    })
      .catch((error) => {
        console.error("O erro que aconteceu:".error);
        toast.error("Erro na requisição, verifique sua conexão.")
      })

    axios.get(URL_TERCEIRIZADAS, {
      params: {
        opc: 'buscaDadosTerceirizadas',
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      console.log(response.data);
      defineDadosTerceirizada(response.data);
    })
      .catch((error) => {
        console.error("O erro que aconteceu:".error);
        toast.error("Erro na requisição, verifique sua conexão.")
      })
  }, []);

  const salvarDados = (dados) => {
    dados.preventDefault(); // para nao dar o refresh
    const { target } = dados;
    const defeito = target.defeito.value;
    const solicitante = target.solicitante.value;

    axios.post(URL_OS, {
      idUbs: idUbs,
      idPro: idPro,
      idTerc: idTerc,
      defeito: defeito,
      solicitante: solicitante
    }
    ).then((resposta) => {
      toast.success('Dados salvos com sucesso !');
      console.log(resposta.data);
      navigate('/menuprincipal');
    }).catch((erro) => {
      toast.warning(erro.response.request.statusText);
      console.log(erro.response.request.statusText);
    })
  }

  return (
    <>
      <div className="tituloPaginas">Fechando Ordem de Serviço</div>
      <form onSubmit={salvarDados}>
        <div className='containerInputs'>
          <p>
            <label>Data Fechamento: {dataAtual()}</label>
          </p>
          <label>
            <p>
              UBS:
            </p>
          </label>
          <label>
            <p>
              Produto / Item com defeito:
            </p>
          </label>
          <p>
           
          </p>
          <p>
           
          </p>
          <label>
            <p>
              Terceirizada para encaminhar O.S:
            </p>
          </label>
        </div>
        <div className="menuRodapePaginas">
          <Link to="../menuprincipal">
            <button type="button" className='botoesMenuRodape'>
              Cancelar
            </button>
          </Link>
          <button type="submit" className='botoesMenuRodape'>
            Salvar O.S
          </button>
        </div>
      </form>
    </>
  )
}
