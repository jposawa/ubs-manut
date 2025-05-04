import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_PRODUTOS, URL_TERCEIRIZADAS, URL_UBS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { Select } from 'antd'
import { dataAtual } from '../compartilhados/funcoes'

export const GerarOs = () => {
  const [dadosUbs, defineDadosUbs] = React.useState([]);
  const [idUbs, setIdUbs] = React.useState([]);
  const [idPro, setIdPro] = React.useState([]);
  const [idTerc, setIdTerc] = React.useState([]);
  const [produtosUbs, defineProdutosUbs] = React.useState([]);
  const [dadosTerceirizada, defineDadosTerceirizada] = React.useState([]);
  const navigate = useNavigate();
  const opcoesTerc = [];
  const [defaltValorProdUbs, setAlteraOpc] = React.useState('Selecione');
  const [opcoesUbs, setOpcoesUbs] = React.useState([]);
  const [opcoesPro, setOpcoesPro] = React.useState([]);

  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }

    axios.get(URL_UBS, {
      params: {
        opc: 'buscaDadosUbs',
        codMunicipio: '2305506'
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
        opc: 'buscaDados',
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

  const handleChangeUbs = value => {
    setAlteraOpc('Selecione');
    setIdUbs(value);
    setIdPro();
    console.log(defaltValorProdUbs);
    axios.get(URL_PRODUTOS, {
      params: {
        opc: 'buscaProdutosUbs',
        idUbs: value,
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      console.log(response.data);
      defineProdutosUbs(response.data);
    })
      .catch((error) => {
        console.error("O erro que aconteceu:", error);
        toast.error("Erro na requisição, verifique sua conexão.")
      })
    console.log(`selecionado: ${value}`);
  };

  const handleChangePro = value => {
    setIdPro(value);
    console.log(`selecionado: ${value}`);
  };

  const handleChangeTerc = value => {
    setIdTerc(value);
    console.log(`selecionado: ${value}`);
  };

  React.useEffect(() => {
    const listaOpcoes = [];
    for (const column in dadosUbs) {
      if (dadosUbs.hasOwnProperty(column)) {
        const opcao = {
          value: dadosUbs[column].id,
          label: `${dadosUbs[column].nome}`
        }
        listaOpcoes.push(opcao);
      }
      setOpcoesUbs(listaOpcoes);
    }
  }, [dadosUbs]);

  React.useEffect(() => {
    const lista = [];
    for (const column in produtosUbs) {
      if (produtosUbs.hasOwnProperty(column)) {
        const opcao = {
          value: produtosUbs[column].id,
          label: `${produtosUbs[column].ambiente}: ${produtosUbs[column].descricao} ${produtosUbs[column].marca}  ${produtosUbs[column].modelo}`
        }
        lista.push(opcao);
      }
      setOpcoesPro(lista);
    }
  }, [produtosUbs]);

  return (
    <>
      <div className="titOS">Gerando Ordem de Serviço</div>
      <form>
        <div className='containerInputs'>
          <p>
            <label>Data da O.S.: {dataAtual()}</label>
          </p>
          <label>
            <p>
              UBS:
            </p>
            {/**
              *Esse não precisou do value porque não tem um value "controlado".
              * O select do produto, o de baixo, tem um `value={variavel}`, o que transforma em um componente "controlado".
              * Por isso lá precisa do handleChange pra atualizar o valor da variável.
              * Esse o handleChange ta servindo mais pra outras coisas, como fazer a nova chamada e zerar o select de baixo
             */}
            <Select
              placeholder="Selecione"
              loading={false}
              style={{ width: 420 }}
              onChange={handleChangeUbs}
              options={opcoesUbs}
            />
          </label>
          <label>
            <p>
              Produto / Item com defeito:
            </p>
            <Select
              placeholder="Selecione"
              value={idPro}
              loading={false}
              style={{ width: 420 }}
              onChange={handleChangePro}
              options={opcoesPro}
            />
          </label>
          <p>
          {
            /**
              * Será que seria o caso de colocar um <textarea> no lugar desse input?
            */
          }
            <Input label="Defeito apresentado:" type="text" name="defeito" size="40" required maxLength="100" placeholder="Digite aqui o problema do aparelho/item" />
          </p>
          <label>
            <p>
              Terceirizada para encaminhar O.S:
            </p>
            <Select
              defaultValue="Selecione"
              loading={false}
              style={{ width: 420 }}
              onChange={handleChangeTerc}
              options={opcoesTerc}
            />
          </label>
        </div>
        <div className="menuProd">
          <Link to="../menuprincipal">
            <button type="button" className='botoesMenuProd'>
              Cancelar
            </button>
          </Link>
          <button type="submit" className='botoesMenuProd'>
            Salvar O.S
          </button>
        </div>
      </form>
    </>
  )
}
