import React from "react";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_SERVICOS } from "../compartilhados/constantes";
import './EstiloGeral.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaServicos = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosServicos, setDadosServicos] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/login');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const idTerceirizada = usuarioSessao.idTerceirizada;
  const buscarDadosServicos = () => {
    setLoading(true);
    axios.get(URL_SERVICOS, {
      params: {
        opc: 'buscaDadosServicos',
        idServico: '',
        idTerc: idTerceirizada
      }
    })
      .then(response => {
        setDadosServicos(response.data);
        //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosServicos(null);
        setLoading(false);
      });
  };
  const excluirServicos = (id) => {
    axios.delete(URL_SERVICOS, {
      params: {
        opc: 'excluirServico',
        id: id
      }
    }).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosServicos();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosServicos.length === 0) {
      buscarDadosServicos();
    }
  }, []);

  return (
    <>
      <div className="tituloPaginas">Serviços Cadastrados</div>
      <ul className="containerInputs">
        {
          dadosServicos.map((opc) => {
            if (dadosServicos.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.ordem} - {opc.descricaoServico}</b>
                  </p>
                  <p>
                    {opc.unidade} <b>{' Cód.Int: '}</b> {opc.codigoInterno} <b>{' Vlr.Serviço: '}</b> {opc.valorServico}
                  </p>
                 
                  <div className="opcLista">
                    <p>
                      {nivelAcesso >= 5 ? (
                        <Popconfirm
                          title="Excluir Serviço"
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirServicos(opc.id)
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
                        <Link to={`/cadaltservicos/${opc.id}`}>
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
        <Link to='../cadaltservicos'>
          <button type="button" className='botoesMenuRodape'>
            Cadastra Serviço
          </button>
        </Link>
      </div>
    </>
  )
}