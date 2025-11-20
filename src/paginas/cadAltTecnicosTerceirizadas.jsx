import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_TECNICOS_TERCEIRIZADAS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { formatarTelefone, gerarUid } from '../compartilhados/funcoes'
import './EstiloGeral.css'
/**
 * Usar styles permite que diferentes arquivos tenham o mesmo nome de className, sem causar conflitos
 */
import styles from "./CadAltProdutos.module.css";

export const CadAltTecnicosTerceirizadas = () => {
  const { id } = useParams();
  const [dadosTecnicosTerceirizadas, defineDadosTecnicosTerceirizadas] = React.useState();
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

    if (id) {
      axios.get(URL_TECNICOS_TERCEIRIZADAS, {
        params: {
          opc: 'buscaDadosTecnicosTerceirizadas',
          idTecnicoTerceirizada: id
        }
      }).then(response => {
        const novoRenderKey = gerarUid();
        //console.log(response.data);
        /**
         * O problema aqui é que a resposta tava vindo um Array
         * E o dadosUbs deveria ser apenas 1 item
         * Então a solução foi pegar o primeiro item
         */
        defineDadosTecnicosTerceirizadas(response.data[0]);

        /**
         * E aqui atualiza a key pra poder forçar a atualização dos elementos de interface
         */
        setRenderKey(novoRenderKey);
      })
        .catch((error) => {
        //  console.error("O erro que aconteceu:".error);
          toast.error("Erro na requisição, verifique sua conexão.")
        })
    }
  }, [id, codMunic]);

  const salvarDadosTecnicosTerceirizadas = (dados) => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
    dados.preventDefault(); // para nao dar o refresh
    const { target } = dados; // pegar os inputs
    const nome = target.nome.value; // pega os valores inputs
    const telefone = target.telefone.value;
    const especialidade = target.especialidade.value;
    const idTerc = usuarioSessao.idTerceirizada;
    if (!id) {
      axios.post(URL_TECNICOS_TERCEIRIZADAS, {
        nome: nome,
        telefone: telefone,
        especialidade: especialidade,
        idTerceirizada: idTerc
      }
      ).then((resposta) => {
        toast.success(resposta.data);
       // console.log(resposta.data);
        navigate('/listatecnicosterceirizadas');
      }).catch((erro) => {
        toast.error(erro);
      })
    }
    else { /// altera, passando o ID
      axios.put(`${URL_TECNICOS_TERCEIRIZADAS}/${id}`, {
        nome: nome,
        telefone: telefone,
        especialidade: especialidade
      }
      ).then((resposta) => {
        toast.success(resposta.data);
      //  console.log(resposta.data);
        navigate('/listatecnicosterceirizadas');
      }).catch((erro) => {
        toast.error(erro);
      })
    }
  }

  return (
    <>
      <div className="tituloPaginas">Cadastro de Técnicos</div>
      <form className={styles.formPrincipal} onSubmit={salvarDadosTecnicosTerceirizadas}>
        <div className='containerInputs'>
          <p>
            <Input label="Nome:" type="text" name="nome" defaultValue={dadosTecnicosTerceirizadas?.nome} size="40" required key={renderKey} maxLength="50"/>
          </p>
          <p>
            <Input label="Telefone:" type="tel" name="telefone" defaultValue={dadosTecnicosTerceirizadas?.telefone} size="16" onChange={formatarTelefone} key={renderKey} maxLength="16" />
          </p>
          <p>
            <Input label="Especialidade:" type="text" name="especialidade" defaultValue={dadosTecnicosTerceirizadas?.especialidade} size="40" key={renderKey} maxLength="40" />
          </p>
        </div>
        <div className="menuRodapePaginas">
          <Link to='../listatecnicosterceirizadas'>
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