import React from "react";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_TERCEIRIZADAS } from "../compartilhados/constantes";
import './EstiloGeral.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaTerceirizadas = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosTerceirizadas, setDadosTerceirizadas] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/login');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const buscarDadosTerceirizadas = () => {
    setLoading(true);
    axios.get(URL_TERCEIRIZADAS, {
      params: {
        opc: 'buscaDadosTerceirizadas',
        idTerc: '',
      }
    })
      .then(response => {
        setDadosTerceirizadas(response.data);
        //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosTerceirizadas(null);
        setLoading(false);
      });
  };
  const excluirTerceirizadas = (id) => {
    axios.delete(URL_TERCEIRIZADAS.concat("/", id)
    ).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosTerceirizadas();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosTerceirizadas.length === 0) {
      buscarDadosTerceirizadas();
    }
  }, []);

  return (
    <>
      <div className="tituloPaginas">Terceirizadas Cadastradas</div>
      <ul className="containerInputs">
        {
          dadosTerceirizadas.map((opc) => {
            if (dadosTerceirizadas.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.ordem} - {opc.razao}</b>
                  </p>
                  <p>
                    <b>{opc.fantasia}</b>
                  </p>
                  <p>
                    {opc.endereco}
                  </p>
                  <p>
                    {opc.bairro}    {opc.cep}
                  </p>
                  <p>
                    {opc.cidade}    {opc.uf}
                  </p>
                  <p>
                    {opc.email}
                  </p>
                  <p>
                    {opc.responsavel}  -  {opc.telResp}
                  </p>
                  <p>
                    {opc.contato}  -  {opc.telContato}
                  </p>

                  <div className="opcLista">
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Popconfirm
                          title="Excluir Terceirizada"
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirTerceirizadas(opc.id)
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
                        <Link to={`/cadaltterceirizadas/${opc.id}`}>
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
        <Link to='../cadaltterceirizadas'>
          <button type="button" className='botoesMenuRodape'>
            Cadastra Terceirizada
          </button>
        </Link>
      </div>
    </>
  )
}