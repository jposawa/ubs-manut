import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados/'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_UBS } from '../compartilhados/constantes'
import { Input } from 'antd'
import './ListaUbs.css'
import { gerarUid } from '../compartilhados/funcoes'

export const CadAltUbs = () => {
  const { id } = useParams();
  const [dadosUbs, defineDadosUbs] = React.useState();
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const navigate = useNavigate();

  const codMunic = usuarioLogado.codMunicipio;
  const munic = usuarioLogado.municipio;
  const uf = usuarioLogado.uf;

  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }

    if (id) {
      axios.get(URL_UBS, {
        params: {
          opc: 'buscaDadosUbs',
          codMunicipio: codMunic,
          idUbs: id,
        }
      }).then(response => {
        const novoRenderKey = gerarUid();

        /**
         * O problema aqui é que a resposta tava vindo um Array
         * E o dadosUbs deveria ser apenas 1 item
         * Então a solução foi pegar o primeiro item
         */
        defineDadosUbs(response.data[0]);

        /**
         * E aqui atualiza a key pra poder forçar a atualização dos elementos de interface
         */
        setRenderKey(novoRenderKey);
      })
        .catch((error) => {
          console.error("O erro que aconteceu:".error);
          toast.error(`Erro na requisição, verifique sua conexão. ${error}`)
        })
    }
  }, []);

  const salvarDados = (dados) => {
    dados.preventDefault(); // para nao dar o refresh
    const { target } = dados; // pegar os inputs
    const nome = target.nome.value; // pega os valores inputs
    const endereco = target.endereco.value;
    const numero = target.numero.value;
    const bairro = target.bairro.value;
    const distrito = target.distrito.value;
    const cep = target.cep.value;
    const contato = target.contato.value;
    const telContato = target.telContato.value;
    axios.post(URL_UBS, {
      nome: nome,
      endereco: endereco,
      numero: numero,
      bairro: bairro,
      distrito: distrito,
      municipio: munic,
      codMunicipio: codMunic,
      uf: uf,
      cep: cep,
      contato: contato,
      telContato: telContato,
    }
    ).then((resposta) => {
      toast.error(resposta.data);
      console.log(resposta.data);
      //  navigate('/menuprincipal');
    }).catch((erro) => {
      toast.error(erro);
    })
  }
 
  return React.useMemo(() => {
   
    return (
      <>
        <div className="titManutUbs">Cadastro da UBS</div>
        <form className='formCadAltUbs' onSubmit={salvarDados}>
          <div className='containerInputs'>
            <p>Nome:
              <Input type="text" name="nome" value={dadosUbs?.nome} size="40" required />
            </p>
            <p>Endereço:
              <Input type="text" name="endereco" value={dadosUbs?.endereco} size="40" required />
            </p>
            <p>Número:
              <Input type="text" name="numero" defaultValue={dadosUbs?.numero} size="6" />
            </p>
            <p>Bairro:
              <Input type="text" name="bairro" defaultValue={dadosUbs?.bairro} size="30" required />
            </p>
            <p>Distrito:
              <Input type="text" name="distrito" defaultValue={dadosUbs?.distrito} size="30" />
            </p>
            <p>Cidade:
              <Input type="text" disabled name="municipio" size="30" defaultValue={munic} />
            </p>
            <p>UF:
              <Input type="text" disabled name="uf" size="2" defaultValue={uf} />
            </p>
            <p>CEP:
              <Input type="tel" name="cep" defaultValue={dadosUbs?.cep} size="10" />
            </p>
            <p>Contato:
              <Input type="text" name="contato" defaultValue={dadosUbs?.contato} size="30" required />
            </p>
            <p>Telefone Contato:
              <Input type="text" name="telContato" defaultValue={dadosUbs?.telContato} size="16" required />
            </p>
          </div>
          <div className="menuUbs">
            <Link to='../listaubs'>
              <button type="button" className='botoesMenuUbs'>
                Cancelar
              </button>
            </Link>
            <button type="submit" className='botoesMenuUbs'>
              Salvar
            </button>
          </div>
        </form>
      </>
    )
  
  },[dadosUbs])
}
