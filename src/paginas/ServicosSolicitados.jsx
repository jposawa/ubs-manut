import React from "react";
import { CheckCircleOutlined, CloseSquareOutlined, DeleteOutlined, FormOutlined, PrinterOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_OS } from "../compartilhados/constantes";
import './EstiloGeral.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";
import { dataDoBanco } from "../compartilhados/funcoes";

export const ServicosSolicitados = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosServicosSol, setDadosServicosSol] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/menuprincipal');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const buscarDadosServicosSol = () => {
    setLoading(true);
    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosServicosSol',
      }
    })
      .then(response => {
        setDadosServicosSol(response.data);
        //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosServicosSol(null);
        setLoading(false);
      });
  };
  const excluirOS = (id) => {
    axios.delete(URL_OS.concat("/", id)
    ).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosServicosSol();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosServicosSol.length === 0) {
      buscarDadosServicosSol();
    }
  }, []);

  return (
    <>
      <div className="tituloPaginas">Serviços Solicitados - O.S. Abertas</div>
      <ul className="containerInputs">
        {
          dadosServicosSol.map((opc) => {
            if (dadosServicosSol.length > 0) {
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
                    <b>Ambiente instalado:</b> {opc.ambienteInstalado}
                  </p>
                  <p>
                    <b>Defeito apresentado:</b>
                    {opc.defeitoApres}
                  </p>
                  <p>
                    <b>Solicitante:</b> {opc.nomeSolicitante}
                  </p>
                  <p>
                    <b>Terceirizada:</b> {opc.fantasiaTerc}
                  </p>

                  <div className="opcLista">
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Popconfirm
                          title="Excluir O.S."
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirOS(opc.id)
                          }}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <button type="button">
                            <DeleteOutlined className="iconeDel" />
                            Excluir
                          </button>
                        </Popconfirm>
                      ) : null}
                    </p>
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Link to={`/fecharos/${opc.id}`}>
                          <button type="button">
                            <CheckCircleOutlined className="icone" />
                            Fechar O.S.
                          </button>
                        </Link>
                      ) : null}
                    </p>
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Link to={`/imprimiros/${opc.id}`}>
                          <button type="button">
                            <PrinterOutlined className="icone" />
                            Imprimir
                          </button>
                        </Link>
                      ) : null}
                    </p>
                  </div>
                </li>
              )
            }
            else {
              <p>
                Nada Cadastrado
              </p>
            }
          })
        }
      </ul>
      <div className="menuRodapePaginas">
        <Link to='../menuprincipal'>
          <button type="button" className='botoesMenuRodape'>
            Retornar
          </button>
        </Link>
      </div>
    </>
  )
}