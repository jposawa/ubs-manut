import React from "react";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_PECAS } from "../compartilhados/constantes";
import './EstiloGeral.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaPecas = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosPecas, setDadosPecas] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/login');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const idTerceirizada = usuarioSessao.idTerceirizada;
  const buscarDadosPecas = () => {
    setLoading(true);
    axios.get(URL_PECAS, {
      params: {
        opc: 'buscaDadosPecas',
        idPeca: '',
        idTerc: idTerceirizada
      }
    })
      .then(response => {
        setDadosPecas(response.data);
        //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosPecas(null);
        setLoading(false);
      });
  };
  const excluirPecas = (id) => {
    axios.delete(URL_PECAS, {
      params: {
        opc: 'excluirPeca',
        id: id
      }
    }).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosPecas();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosPecas.length === 0) {
      buscarDadosPecas();
    }
  }, []);

  return (
    <>
      <div className="tituloPaginas">Peças Cadastradas</div>
      <ul className="containerInputs">
        {
          dadosPecas.map((opc) => {
            if (dadosPecas.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.ordem} - {opc.descricao}</b>
                  </p>
                  <p>
                    {opc.unidade} <b>{' Cód.Int: '}</b> {opc.codigoInterno} <b>{' Pr.Venda: '}</b> {opc.precoVenda}
                  </p>
                 
                  <div className="opcLista">
                    <p>
                      {nivelAcesso >= 5 ? (
                        <Popconfirm
                          title="Excluir Peça"
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirPecas(opc.id)
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
                      {nivelAcesso >= 5 ? (
                        <Link to={`/cadaltpecas/${opc.id}`}>
                          <button type="button">
                            <FormOutlined className="icone" />
                            Alterar
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
        <Link to='../cadaltpecas'>
          <button type="button" className='botoesMenuRodape'>
            Cadastrar Peça
          </button>
        </Link>
      </div>
    </>
  )
}