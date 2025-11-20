import React from "react";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_TECNICOS_TERCEIRIZADAS } from "../compartilhados/constantes";
import './EstiloGeral.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaTecnicosTerceirizadas = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosTecnicosTerceirizadas, setDadosTecnicosTerceirizadas] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/login');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const idTerceirizada = usuarioSessao.idTerceirizada;
  const buscarDadosTecnicosTerceirizadas = () => {
    setLoading(true);
    axios.get(URL_TECNICOS_TERCEIRIZADAS, {
      params: {
        opc: 'buscaDadosTecnicosTerceirizadas',
        idTecnicoTerceirizada: '',
        idTerc: idTerceirizada
      }
    })
      .then(response => {
        setDadosTecnicosTerceirizadas(response.data);
        //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosTecnicosTerceirizadas(null);
        setLoading(false);
      });
  };
  const excluirTecnicosTerceirizadas = (id) => {
    axios.delete(URL_TECNICOS_TERCEIRIZADAS, {
      params: {
        opc: 'excluirTecnicoTerceirizada',
        id: id
      }
    }).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosTecnicosTerceirizadas();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosTecnicosTerceirizadas.length === 0) {
      buscarDadosTecnicosTerceirizadas();
    }
  }, []);

  return (
    <>
      <div className="tituloPaginas">Técnicos Cadastrados</div>
      <ul className="containerInputs">
        {
          dadosTecnicosTerceirizadas.map((opc) => {
            if (dadosTecnicosTerceirizadas.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.ordem} - {opc.nome}</b>
                  </p>
                  <p>
                    {opc.telefone} <b>{' Especialidade: '}</b> {opc.especialidade}
                  </p>
                 
                  <div className="opcLista">
                    <p>
                      {nivelAcesso >= 5 ? (
                        <Popconfirm
                          title="Excluir Técnico"
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirTecnicosTerceirizadas(opc.id)
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
                        <Link to={`/cadalttecnicosterceirizadas/${opc.id}`}>
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
        <Link to='../cadalttecnicosterceirizadas'>
          <button type="button" className='botoesMenuRodape'>
            Cadastrar Técnico
          </button>
        </Link>
      </div>
    </>
  )
}