import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_OS, URL_SERVICOS, URL_PECAS } from '../compartilhados/constantes'
import { Input } from '../componentes'
import { dataAtual, dataDoBanco, dataParaBanco, formatarValor } from '../compartilhados/funcoes'
import { Select } from '@mantine/core'
import './EstiloGeral.css'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'

export const FecharOs = () => {
  const { id } = useParams();
  // const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [dadosOs, defineDadosOs] = React.useState([]);
  const [dadosServicosOS, defineDadosServicosOS] = React.useState([]);
  const [dadosPecasOS, defineDadosPecasOS] = React.useState([]);
  const navigate = useNavigate();

  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
  const idTerceirizada = usuarioSessao.idTerceirizada;
  React.useEffect(() => {
    //const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/servicossolicitados');
    }
    //console.log('ID OS: ' + id);
    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosServicosSol',
        idOS: id,
        status: 'A'
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      //  console.log(response.data);
      defineDadosOs(response.data);
    })
      .catch((error) => {
        //console.error("O erro que aconteceu:".error);
        toast.error("Erro na requisição, verifique sua conexão.")
      })

    axios.get(URL_SERVICOS, {
      params: {
        opc: 'buscaDadosServicosOS',
        idOS: id
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      //  console.log(response.data);
      defineDadosServicosOS(response.data);
    })
      .catch((error) => {
        //console.error("O erro que aconteceu:".error);
        //    toast.error("Erro na requisição, verifique sua conexão.")
      })

    axios.get(URL_PECAS, {
      params: {
        opc: 'buscaDadosPecasOS',
        idOS: id
      }
    }).then(response => {
      //  const novoRenderKey = gerarUid();
      //  console.log(response.data);
      defineDadosPecasOS(response.data);
    })
      .catch((error) => {
        //console.error("O erro que aconteceu:".error);
        //    toast.error("Erro na requisição, verifique sua conexão.")
      })

  }, []);

  const totalSer = dadosServicosOS.reduce((valorAtual, item) => {
    valorAtual += Number(item.valorCobrado);
    return valorAtual
  }, 0)
  const totalServicos = totalSer.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalPec = dadosPecasOS.reduce((valorAtual, item) => {
    valorAtual += Number(item.valorCobrado);
    return valorAtual
  }, 0)
  const totalPecas = totalPec.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let subTotal = (totalSer + totalPec);

  let totDesconto =  Number(dadosOs?.[0]?.desconto ?? 0);

  const desconto = totDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const totalOs = (subTotal - totDesconto).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  subTotal = subTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  
  const salvarDadosFechamentoOs = (dados) => {
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
      //  console.log(resposta.data);
      navigate('/servicossolicitados');
    }).catch((erro) => {
      toast.warning(erro.response.request.statusText);
      //  console.log(erro.response.request.statusText);
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
      <span className="containerInputs">
        {
          dadosOs.map((opc) => {
            if (dadosOs.length > 0) {
              return (
                <span key={opc.id}>
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
                  <p><hr /></p>
                  <p>
                    <b>Serviço(s) realizado(s): </b>
                    <span className='maisItensOS'>
                      <PlusCircleOutlined />
                    </span>
                  </p>
                  {
                    dadosServicosOS.map((ser) => {
                      if (dadosServicosOS.length > 0) {
                        return (
                          <>
                            <div key={ser.id}>
                              <div className='itensOs'>
                                <div>
                                  {ser.codigoInterno}
                                </div>
                                <div>
                                  {ser.pecaServico}
                                </div>
                                <div>
                                  {ser.valorCobrado}
                                </div>
                                <div>
                                  {<DeleteOutlined />}
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      }

                    })
                  }
                  <div className='totalItensOs'>
                    <div>
                      Valor total do(s) serviço(s): R$
                    </div>
                    <div>
                      {totalServicos}
                    </div>
                    <div></div>
                  </div>
                  <p><hr /></p>
                  <p>
                    <b>Peça(s) utilizada(s): </b>
                    <span className='maisItensOS'>
                      <PlusCircleOutlined />
                    </span>
                  </p>
                  {
                    dadosPecasOS.map((pec) => {
                      if (dadosPecasOS.length > 0) {
                        return (
                          <>
                            <div key={pec.id}>
                              <div className='itensOs'>
                                <div>
                                  {pec.codigoInterno}
                                </div>
                                <div>
                                  {pec.pecaServico}
                                </div>
                                <div>
                                  {pec.valorCobrado}
                                </div>
                                <div>
                                  {<DeleteOutlined />}
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      }
                    })
                  }
                  <div className='totalItensOs'>
                    <div>
                      Valor total da(s) peça(s): R$
                    </div>
                    <div>
                      {totalPecas}
                    </div>
                    <div></div>
                  </div>
                  <p><hr /></p>
                  <p>
                    <div className='totalizandoOS'>
                      <div>
                        Sub-Total: R$ {subTotal}
                      </div>
                      <div>
                        Desconto: R$ {desconto}
                        { }
                      </div>
                      <div>
                        <b>TOTAL DA O.S.: R$ {totalOs}</b>
                      </div>
                    </div>
                  </p>
                  <p><hr /></p>
                  <form onSubmit={salvarDadosFechamentoOs}>
                    <div className='containerInputs'>
                      <label>
                        <p>
                          Data Fechamento: {dataAtual()}
                        </p>
                      </label>
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
                </span>
              )
            }
          })
        }
      </span>
    </>
  )
}
