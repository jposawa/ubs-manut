import React from "react";
import { DeleteOutlined, DiffOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_UBS } from "../compartilhados/constantes";
import './EstiloGeral.css';
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
  const codMunic = usuarioSessao.codMunicipio;
  const buscarDadosUbs = () => {
    setLoading(true);
    axios.get(URL_UBS, {
      params: {
        opc: 'buscaDadosUbs',
        codMunicipio: codMunic,
        idUbs: '',
      }
    })
      .then(response => {
        setDadosUbs(response.data);
        //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosUbs(null);
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
      <div className="tituloPaginas">Unidades Básicas de Saúde</div>
      <ul className="containerInputs">
        {
          dadosUbs.map((opc) => {
            if (dadosUbs.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.ordem} - {opc.nome}</b>
                  </p>
                  <p>
                    {opc.endereco} {opc.numero}
                  </p>
                  <p>
                    {opc.bairro}  -  {opc.distrito}
                  </p>
                  <p>
                    {opc.contato}  -  {opc.telContato}
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
                            <DeleteOutlined className="iconeDel" />
                            Excluir
                          </button>
                        </Popconfirm>
                      ) : null}
                    </p>
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Link to={`/cadaltubs/${opc.id}`}>
                          <button type="button">
                            <FormOutlined className="icone" />
                            Alterar
                          </button>
                        </Link>
                      ) : null}
                    </p>
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Link to={`/listaprodutosubs/${opc.id}`}>
                          <button type="button">
                            <DiffOutlined className="icone" />
                            Prod./Itens na UBS
                          </button>
                        </Link>
                      ) : null}
                    </p>
                  </div>
                </li>
              )
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
        <Link to='../cadaltubs'>
          <button type="button" className='botoesMenuRodape'>
            Cadastra UBS
          </button>
        </Link>
      </div>
    </>
  )
}