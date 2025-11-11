import React from "react";
import { DeleteOutlined, DiffOutlined, FormOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import { URL_PRODUTOS, URL_UBS } from "../compartilhados/constantes";
import './EstiloGeral.css';
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";

export const ListaProdutosUbs = () => {
  const { id } = useParams();
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [loading, setLoading] = React.useState(false);
  const [dadosUbs, setDadosUbs] = React.useState([]);
  const [dadosProdutosUbs, setDadosProdutosUbs] = React.useState([]);
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
        idUbs: id,
      }
    })
      .then(response => {
        setDadosUbs(response.data[0]);
        // console.log(response.data);
        axios.get(URL_PRODUTOS, {
          params: {
            opc: 'buscaProdutosUbs',
            idUbs: id,
          }
        })
          .then(response => {
            setDadosProdutosUbs(response.data);
            //  console.log(response.data);
            setLoading(false);
          })
          .catch(error => {
            //    console.error('Erro ao buscar dados:', error);
            setDadosProdutosUbs([{ "id": "1", "ordem": "0", "descricao": "Nenhum Produto/Item lançado nesta UBS" }]);
            setLoading(false);
          });
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosUbs(null);
        setLoading(false);
      });
  };

  const excluirProdutoUbs = (idProdUbs) => {
    axios.delete(URL_PRODUTOS, {
      params: {
        opc: 'excluirProdutoUbs',
        id: idProdUbs
      }
    }).then(() => {
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
      <h3>
        Produtos/Itens: {dadosUbs.nome}
      </h3>
      <ul className="listaPrincipal">
        {
          dadosProdutosUbs.map((prod) => {
            return (
              <li key={prod.ordem}>
                <p>
                  {prod.ordem} - {prod.descricao} {prod.marca} {prod.modelo} {prod.referencia}
                </p>
                <p>
                  <b>{'Ambiente:'}</b><i> {prod.ambiente}</i>
                </p>
                <p>
                  {nivelAcesso >= 9 ? (
                    <Popconfirm
                      title="Excluir Produto da UBS"
                      description="Confirma exclusão ?"
                      onConfirm={() => {
                        excluirProdutoUbs(prod.id)
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
              </li>
            )
          })
        }
      </ul>
      <div className="menuRodapePaginas">
        <Link to='../listaubs'>
          <button type="button" className='botoesMenuRodape'>
            Retornar
          </button>
        </Link>
        <Link to={`../cadastraprodutosubs/${id}`}>
          <button type="button" className='botoesMenuRodape'>
            Incluir Produto/Item
          </button>
        </Link>
      </div>
    </>
  )
}