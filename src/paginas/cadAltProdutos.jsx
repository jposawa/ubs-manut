import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_PRODUTOS, URL_TERCEIRIZADAS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { formatarCep, formatarTelefone, gerarUid } from '../compartilhados/funcoes'
import './EstiloGeral.css'
/**
 * Usar styles permite que diferentes arquivos tenham o mesmo nome de className, sem causar conflitos
 */
import styles from "./CadAltProdutos.module.css";

export const CadAltProdutos = () => {
  const { id } = useParams();
  const [dadosProdutos, defineDadosProdutos] = React.useState();
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const navigate = useNavigate();
  /**
   * Usando essa variável de estado local pra forçar atualização do sistema de UI
   * Outra forma de fazer isso seria usar `value` no lugar de `defaultValue`
   * 
   * O problema: Fazer isso precisaria que o sr aplicasse `onChange` em todos os Inputs
   * Então dessa forma contorna esse problema
   */
  const [renderKey, setRenderKey] = React.useState();

  /**
   * Fazendo isso para caso, por algum motivo, os dados do usuarioLogado ainda não estejam disponíveis
   * Como um refresh, por exemplo
   * Os dados são pegos no useMemo e voltam como um objeto
   * E aí na linha inicial, o objeto é desconstruído
   */
  const { codMunic, munic, uf } = React.useMemo(() => {
    if (!usuarioLogado?.uf) {
      return {}
    }
    const codMunic = usuarioLogado.codMunicipio;
    const munic = usuarioLogado.municipio;
    const uf = usuarioLogado.uf;

    return {
      codMunic,
      munic,
      uf,
    }

  }, [usuarioLogado])

  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }

    if (id && codMunic) {
      axios.get(URL_PRODUTOS, {
        params: {
          opc: 'buscaDadosProdutos',
          idProd: Number(id),
        }
      }).then(response => {
        const novoRenderKey = gerarUid();
        console.log(response.data);
        /**
         * O problema aqui é que a resposta tava vindo um Array
         * E o dadosUbs deveria ser apenas 1 item
         * Então a solução foi pegar o primeiro item
         */
        defineDadosProdutos(response.data[0]);

        /**
         * E aqui atualiza a key pra poder forçar a atualização dos elementos de interface
         */
        setRenderKey(novoRenderKey);
      })
        .catch((error) => {
          console.error("O erro que aconteceu:".error);
          toast.error("Erro na requisição, verifique sua conexão.")
        })
    }
  }, [id, codMunic]);

  const salvarDados = (dados) => {
    dados.preventDefault(); // para nao dar o refresh
    const { target } = dados; // pegar os inputs
    const descricao = target.descricao.value; // pega os valores inputs
    const marca = target.marca.value;
    const modelo = target.modelo.value;
    const referencia = target.referencia.value;
    if (!id) {
      axios.post(URL_PRODUTOS, {
        descricao: descricao,
        marca: marca,
        modelo: modelo,
        referencia: referencia
      }
      ).then((resposta) => {
        toast.success(resposta.data);
       // console.log(resposta.data);
        navigate('/listaprodutos');
      }).catch((erro) => {
        toast.error(erro);
      })
    }
    else { /// altera, passando o ID
      axios.put(`${URL_PRODUTOS}/${id}`, {
        descricao: descricao,
        marca: marca,
        modelo: modelo,
        referencia: referencia
      }
      ).then((resposta) => {
        toast.success(resposta.data);
      //  console.log(resposta.data);
        navigate('/listaprodutos');
      }).catch((erro) => {
        toast.error(erro);
      })
    }
  }

  return (
    <>
      <div className="tituloPaginas">Cadastro de Produtos</div>
      <form className={styles.formPrincipal} onSubmit={salvarDados}>
        <div className='containerInputs'>
          <p>
            <Input label="Descrição:" type="text" name="descricao" defaultValue={dadosProdutos?.descricao} size="40" required key={renderKey} maxLength="40"/>
          </p>
          <p>
            <Input label="Marca:" type="text" name="marca" defaultValue={dadosProdutos?.marca} size="40" required key={renderKey} maxLength="40" />
          </p>
          <p>
            <Input label="Modelo:" type="text" name="modelo" defaultValue={dadosProdutos?.modelo} size="40" required key={renderKey} maxLength="40" />
          </p>
          <p>
            <Input label="Referência:" type="text" maxLength="30" name="referencia" defaultValue={dadosProdutos?.referencia} size="30" key={renderKey} />
          </p>
        </div>
        <div className="menuRodapePaginas">
          <Link to='../listaprodutos'>
            <button type="button" className='botoesMenuRodape'>
              Cancelar
            </button>
          </Link>
          <button type="submit" className='botoesMenuRodape'>
            Salvar
          </button>
        </div>
      </form>
    </>
  )
}
