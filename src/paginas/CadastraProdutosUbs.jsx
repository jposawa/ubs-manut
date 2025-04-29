import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_PRODUTOS, URL_TERCEIRIZADAS, URL_UBS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { gerarUid } from '../compartilhados/funcoes'
import './ListaProdutos.css'
/**
 * Usar styles permite que diferentes arquivos tenham o mesmo nome de className, sem causar conflitos
 */
import styles from "./CadAltProdutos.module.css";
import { Select } from 'antd'

export const CadastraProdutosUbs = () => {
  const { id } = useParams();
  const [dadosProdutos, defineDadosProdutos] = React.useState([]);
  const listaOpcoes = [];
  const [options, setOptions] = React.useState({});
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const navigate = useNavigate();
  const [idProduto, setIdProduto] = React.useState(null);

  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }
    axios.get(URL_PRODUTOS, {
      params: {
        opc: 'buscaDadosProdutos',
        idProd: '',
      }
    }).then(response => {
      const novoRenderKey = gerarUid();
    //  console.log(response.data);
      defineDadosProdutos(response.data);
    })
      .catch((error) => {
        console.error("O erro que aconteceu:".error);
        toast.error("Erro na requisição, verifique sua conexão.")
      })
  }, []);

  const salvarDados = (dados) => {
    dados.preventDefault(); // para nao dar o refresh
    const { target } = dados; // pegar os inputs
   // const idProduto = target.idProduto.value;
    const ambiente = target.ambiente.value;

    axios.post(URL_UBS, {
      opc: 'salvarProdutosUbs',
      idUbs: id,
      idProduto: idProduto,
      ambiente: ambiente
    }
    ).then((resposta) => {
      toast.error(resposta.data);
    //  console.log(resposta.data);
      navigate('/listaprodutosubs/' + id);
    }).catch((erro) => {
      toast.error(erro);
      console.log(erro);
    })
  }
  const handleChange = value => {
    setIdProduto(value);
  //  console.log(`selected ${value}`);
  };

  React.useEffect(() => {
    for (const column in dadosProdutos) {
      if (dadosProdutos.hasOwnProperty(column)) {
        const opcao = {
          value: dadosProdutos[column].id,
          label: `${dadosProdutos[column].descricao}\n${dadosProdutos[column].marca}\n${dadosProdutos[column].modelo}`
        }
        listaOpcoes.push(opcao);
      }
      setOptions(listaOpcoes);
    }
  }, [dadosProdutos]);
  //console.log(options);
  return (
    <>
      <div className="titManutProd">Cadastro de Produtos</div>
      <form className={styles.formPrincipal} onSubmit={salvarDados}>
        <div className='containerInputs'>
          <p>
            <label>Produto / Item:</label>
          </p>
          <p>
            <Select
              defaultValue="Selecione"
              loading={false}
              style={{ width: 420 }}
              onChange={handleChange}
              options={options}
            />
          </p>
          <p>
            <Input label="Ambiente instalado:" type="text" name="ambiente" size="40" required maxLength="40" placeholder="Ex.: recepção" />
          </p>
        </div>
        <div className="menuProd">
          <Link to={`../listaprodutosubs/${id}`}>
            <button type="button" className='botoesMenuProd'>
              Cancelar
            </button>
          </Link>
          <button type="submit" className='botoesMenuProd'>
            Salvar
          </button>
        </div>
      </form>
    </>
  )
}
