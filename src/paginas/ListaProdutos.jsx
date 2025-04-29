import React from "react";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_PRODUTOS } from "../compartilhados/constantes";
import './ListaProdutos.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaProdutos = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosProdutos, setDadosProdutos] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/login');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  const buscarDadosProdutos = () => {
    setLoading(true);
    axios.get(URL_PRODUTOS, {
      params: {
        opc: 'buscaDadosProdutos',
        idProd: '',
      }
    })
      .then(response => {
        setDadosProdutos(response.data);
     //   console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
    //    console.error('Erro ao buscar dados:', error);
        setDadosProdutos(null);
        setLoading(false);
      });
  };
  const excluirProdutos = (id) => {
    axios.delete(URL_PRODUTOS, {
      params: {
        opc: 'excluirProduto',
        id: id
      }
    }).then(() => {
      toast.warn('Exclusão realizada com sucesso !');
      buscarDadosProdutos();
    }).catch((erro) => {
      toast.error("Erro na exclusão, verifique sua conexão.")
    })
  }

  React.useEffect(() => {
    if (!loading && dadosProdutos.length === 0) {
      buscarDadosProdutos();
    }
  }, []);

  return (
    <>
      <div className="titManutProd">Produtos Cadastrados</div>
      <ul className="containerProd">
        {
          dadosProdutos.map((opc) => {
            if (dadosProdutos.length > 0) {
              return (
                <li key={opc.id}>
                  <p>
                    <b>{opc.ordem} - {opc.descricao}</b>
                  </p>
                  <p>
                    {opc.marca} {opc.modelo} {opc.referencia}
                  </p>
                  <div className="opcLista">
                    <p>
                      {nivelAcesso >= 9 ? (
                        <Popconfirm
                          title="Excluir Produto"
                          description="Confirma exclusão ?"
                          onConfirm={() => {
                            excluirProdutos(opc.id)
                          }}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <button type="button">
                            <DeleteOutlined className="iconeDel" />
                          </button>
                        </Popconfirm>
                      ) : null}
                    </p>
                    <p>
                      {nivelAcesso >= 9 ? (
                        <button type="button">
                          <Link to={`/cadaltprodutos/${opc.id}`}>
                            <FormOutlined  className="icone"/>
                          </Link>
                        </button>
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
      <div className="menuProd">
        <Link to='../menuprincipal'>
          <button type="button" className='botoesMenuProd'>
            Retornar
          </button>
        </Link>
        <Link to='../cadaltprodutos'>
          <button type="button" className='botoesMenuProd'>
            Cadastra Produto
          </button>
        </Link>
      </div>
    </>
  )
}