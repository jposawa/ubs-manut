import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_TERCEIRIZADAS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { formatarCep, formatarTelefone, gerarUid } from '../compartilhados/funcoes'
import './ListaTerceirizadas.css'
/**
 * Usar styles permite que diferentes arquivos tenham o mesmo nome de className, sem causar conflitos
 */
import styles from "./CadAltTerceirizadas.module.css";

export const CadAltTerceirizadas = () => {
  const { id } = useParams();
  const [dadosTerceirizadas, defineDadosTerceirizadas] = React.useState();
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
      axios.get(URL_TERCEIRIZADAS, {
        params: {
          opc: 'buscaDadosTerceirizadas',
          idTerc: Number(id),
        }
      }).then(response => {
        const novoRenderKey = gerarUid();
        console.log(response.data);
        /**
         * O problema aqui é que a resposta tava vindo um Array
         * E o dadosUbs deveria ser apenas 1 item
         * Então a solução foi pegar o primeiro item
         */
        defineDadosTerceirizadas(response.data[0]);

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
    const razao = target.razao.value; // pega os valores inputs
    const fantasia = target.fantasia.value;
    const endereco = target.endereco.value;
    const cidade = target.cidade.value;
    const bairro = target.bairro.value;
    const uf = target.uf.value;
    const cep = target.cep.value;
    const responsavel = target.responsavel.value;
    const telResp = target.telResp.value;
    const contato = target.contato.value;
    const telContato = target.telContato.value;
    if (!id) {
      axios.post(URL_TERCEIRIZADAS, {
        razao: razao,
        fantasia: fantasia,
        endereco: endereco,
        cidade: cidade,
        bairro: bairro,
        uf: uf,
        responsavel: responsavel,
        telResp: telResp,
        cep: cep,
        contato: contato,
        telContato: telContato,
      }
      ).then((resposta) => {
        toast.error(resposta.data);
       // console.log(resposta.data);
        navigate('/listaterceirizadas');
      }).catch((erro) => {
        toast.error(erro);
      })
    }
    else { /// altera, passando o ID
      axios.put(`${URL_TERCEIRIZADAS}/${id}`, {
        razao: razao,
        fantasia: fantasia,
        endereco: endereco,
        cidade: cidade,
        bairro: bairro,
        uf: uf,
        responsavel: responsavel,
        telResp: telResp,
        cep: cep,
        contato: contato,
        telContato: telContato,
      }
      ).then((resposta) => {
        toast.error(resposta.data);
      //  console.log(resposta.data);
        navigate('/listaterceirizadas');
      }).catch((erro) => {
        toast.error(erro);
      })
    }
  }

  return (
    <>
      <div className="titManutTerc">Cadastro de Terceirizadas</div>
      <form className={styles.formPrincipal} onSubmit={salvarDados}>
        <div className='containerInputs'>
          <p>
            <Input label="Razão Social:" type="text" name="razao" defaultValue={dadosTerceirizadas?.razao} size="40" required key={renderKey} maxLength="40"/>
          </p>
          <p>
            <Input label="Nome Fantasia:" type="text" name="fantasia" defaultValue={dadosTerceirizadas?.fantasia} size="40" required key={renderKey} maxLength="40" />
          </p>
          <p>
            <Input label="Endereço:" type="text" name="endereco" defaultValue={dadosTerceirizadas?.endereco} size="40" required key={renderKey} maxLength="40" />
          </p>
          <p>
            <Input label="Bairro:" type="text" maxLength="30" name="bairro" defaultValue={dadosTerceirizadas?.bairro} size="30" key={renderKey} />
          </p>
          <p>
            <Input label="Cidade:" type="text" maxLength="30" name="cidade" defaultValue={dadosTerceirizadas?.cidade} size="30" key={renderKey} />
          </p>
          <p>
            <Input label="UF:" type="text" maxLength="2" name="uf" defaultValue={dadosTerceirizadas?.uf} size="2" key={renderKey} mesmaLinha />
          </p>
         
          <p>
            <Input label="CEP:" type="tel" name="cep" defaultValue={dadosTerceirizadas?.cep} size="10" maxLength="9" key={renderKey} onChange={formatarCep} mesmaLinha />
          </p>
          <p>
            <Input label="Responsável Empresa:" type="text" name="responsavel" defaultValue={dadosTerceirizadas?.responsavel} size="30" required key={renderKey} maxLength="30" />
          </p>
          <p>
            <Input label="Telefone Responsavel:" type="tel" name="telResp" defaultValue={dadosTerceirizadas?.telResp} size="16" maxLength="16" onChange={formatarTelefone} required key={renderKey} />
          </p>
          <p>
            <Input label="Contato:" type="text" name="contato" defaultValue={dadosTerceirizadas?.contato} size="30" required key={renderKey} maxLength="30"/>
          </p>
          <p>
            <Input label="Telefone Contato:" type="tel" name="telContato" defaultValue={dadosTerceirizadas?.telContato} size="16" maxLength="16" onChange={formatarTelefone} key={renderKey} />
          </p>
        </div>
        <div className="menuTerc">
          <Link to='../listaterceirizadas'>
            <button type="button" className='botoesMenuTerc'>
              Cancelar
            </button>
          </Link>
          <button type="submit" className='botoesMenuTerc'>
            Salvar
          </button>
        </div>
      </form>
    </>
  )
}
