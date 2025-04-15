import React from "react";
import { DeleteOutlined, FormOutlined, OrderedListOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_UBS } from "../compartilhados/constantes";
import './ListaUbs.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaUbs = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosUbs, setDadosUbs] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/login');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const buscarDadosUbs = () => {
    setLoading(true);
    axios.get(URL_UBS, {
      params: {
        opc: 'buscaDadosUbs',
        codMunicipio: '0',
      }
    })
      .then(response => {
        setDadosUbs(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  };
  const excluirUbs = (id) => {
    axios.delete(URL_UBS.concat("/", id)
    ).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosUbs();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosUbs.length === 0) {
      buscarDadosUbs();
    }
  }, []);

  return (
    <>
      <div className="titManutUbs"><h3>Unidades Básicas de Saúde</h3></div>
      <ul className="containerUbs">
        {
          dadosUbs.map((opc) => {
            return (
              <li key={opc.id}>
                <p>
                  <b>{opc.nome}</b>
                </p>
                <p>
                  {opc.endereco + ' ' + opc.numero}
                </p>
                <p>
                  {opc.bairro + ' - ' + opc.distrito}
                </p>
                <p>
                  {opc.contato + ' - ' + opc.telContato}
                </p>
                <div className="opcLista">
                  <p>
                    {nivelAcesso >= 9 ? (
                      <Popconfirm
                        title="Excluir UBS"
                        description="Confirma exclusão ?"
                        onConfirm={() => {
                          excluirUbs(opc.id)
                        }}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <button type="button">
                          <DeleteOutlined className="icone" />
                        </button>
                      </Popconfirm>
                    ) : null}
                  </p>
                  <p>
                    {nivelAcesso >= 9 ? (
                      <button type="button" onClick={() => {
                        setModalLancPadroes({ id: opc.idHistorico, historico: opc.historicoPadrao, status: opc.status })
                      }
                      }>
                        <FormOutlined className="icone" />
                      </button>
                    ) : null}
                  </p>
                </div>
              </li>
          
            )
          })
        }
      </ul>
    </>
  )
}