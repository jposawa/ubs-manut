import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_OS, URL_PRODUTOS, URL_TERCEIRIZADAS, URL_UBS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { dataAtual, dataDoBanco, dataParaBanco, formatarValor } from '../compartilhados/funcoes'
import { Select } from '@mantine/core'
import './EstiloGeral.css'

export const FecharOs = () => {
  const { id } = useParams();
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [dadosOs, defineDadosOs] = React.useState([]);
  const navigate = useNavigate();
  const [dadosTerceirizada, defineDadosTerceirizada] = React.useState([]);
  // const [idTec, setIdTec] = React.useState([]);
  // const [opcoesTec, setOpcoesTec] = React.useState([]);
  const codMunic = usuarioLogado.codMunicipio;
  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/servicossolicitados');
    }
    //console.log('ID OS: ' + id);
    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosServicosSol',
        idOS: id
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      console.log(response.data);
      defineDadosOs(response.data);
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
    const servicos = target.servicos.value;
    const pecas = target.pecas.value;
    const valorServicos = target.valorServicos.value;
    const valorPecas = target.valorPecas.value;
    const obs = target.obs.value;

    axios.put(`${URL_OS}/${id}`, {
      servicoRealizado: servicos,
      pecaSubstReparada: pecas,
      valorServico: valorServicos,
      valorPecas: valorPecas,
      dataFechamentoOS: dataParaBanco(dataAtual()),
      obs: obs,
      statusOS: 'F'
    }
    ).then((resposta) => {
      toast.success('Dados salvos com sucesso !');
      console.log(resposta.data);
      navigate('/servicossolicitados');
    }).catch((erro) => {
      toast.warning(erro.response.request.statusText);
      console.log(erro.response.request.statusText);
    })
  }
  /*
  React.useEffect(() => {
    const lista = [];
    for (const column in dadosTerceirizada) {
      if (dadosTerceirizada.hasOwnProperty(column)) {
        const opcao = {
          value: dadosTerceirizada[column].id,
          label: `${dadosTerceirizada[column].razao}: ${dadosTerceirizada[column].fantasia}`
        }
        lista.push(opcao);
      }
      setOpcoesTec(lista);
    }
  }, [dadosTerceirizada]);


  const handleChangeTec = value => {
    setIdTec(value);
    console.log(`selecionado: ${value}`);
  };
*/
  return (
    <>
      <div className="tituloPaginas">Fechando Ordem de Serviço</div>
      <ul className="containerInputs">
        {
          dadosOs.map((opc) => {
            if (dadosOs.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.nomeUbs}</b>
                  </p>
                  <p>
                    <b>Abertura O.S.:</b> {dataDoBanco(opc.dataAberturaOS)}
                  </p>
                  <p>
                    <b>Produto/Item:</b> {opc.descricao} {opc.marca} {opc.modelo} {opc.referencia}
                  </p>
                  <p>
                    <b>Defeito apresentado:</b>
                    {opc.defeitoApres}
                  </p>
                  <p>
                    <b>Ambiente instalado:</b> {opc.ambienteInstalado}
                  </p>

                  <form onSubmit={salvarDados}>
                    <div className='containerInputs'>
                      <label>
                        <p>
                          Data Fechamento: {dataAtual()}
                        </p>
                        <p>
                          <Input label="Serviço realizado:" type="text" name="servicos" size="30" required maxLength="150" placeholder="Digite aqui o serviço realizado" />
                        </p>
                      </label>
                      <label>
                        <p>
                          <Input label="Peças substituidas:" type="text" name="pecas" size="30" maxLength="150" placeholder="Foram substituídas peças ? Digite aqui." />
                        </p>
                      </label>
                      <label>
                        <p>
                          <Input label="Valor do(S) serviço(S):" type="tel" name="valorServicos" size="8" maxLength="12" required onChange={formatarValor} mesmaLinha />
                        </p>
                      </label>
                      <label>
                        <p>
                          <Input label="Valor da(s) peça(s):" type="tel" name="valorPecas" size="8" maxLength="12" onChange={formatarValor} mesmaLinha />
                        </p>
                      </label>
                      <label>
                        <p>
                          <Input label="Observação:" type="text" name="obs" size="30" maxLength="150" placeholder="Relata aqui alguma obs, caso necessário." />
                        </p>
                      </label>
                      {/*  <label>
                        <p>
                          Técnico responsável: 
                        </p>
                       <Select
                          placeholder="Selecione"
                          style={{ width: 400 }}
                          onChange={handleChangeTec}
                          data={opcoesTec}
                          allowDeselect={true}
                        /> 
                      </label>*/}
                    </div>
                    <div className="menuRodapePaginas">
                      <Link to="../servicossolicitados">
                        <button type="button" className='botoesMenuRodape'>
                          Cancelar
                        </button>
                      </Link>
                      <button type="submit" className='botoesMenuRodape'>
                        Fechar O.S
                      </button>
                    </div>
                  </form>
                </li>
              )
            }
          })
        }
      </ul>
    </>
  )
}
