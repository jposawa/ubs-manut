import React from "react";
import './EstiloGeral.css';
import { Link, useNavigate } from "react-router-dom";
//import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";
import { FileAddOutlined, FileDoneOutlined, LogoutOutlined, MedicineBoxOutlined, ProductOutlined, SettingOutlined, SnippetsOutlined, SolutionOutlined, SyncOutlined, ToolOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Icone } from "../componentes";

export const MenuPrincipal = () => {
  // const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  const nivelAcesso = usuarioSessao?.nivelAcesso;
  const idTerceirizada = usuarioSessao?.idTerceirizada;
  let capiton = 'Terceirizadas';
  if (idTerceirizada > 0)
  {
    capiton = 'Dados da Empresa';
  }
  React.useEffect(() => {
    //  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <div className='areaMenu'>
        {nivelAcesso >= 9 ? (
          <Link to='/geraros'>
            <button type="button" className='botaoMenu'>
              <Icone
                elementoIcone={< SettingOutlined />}
              />
              <p>Gerar</p><p>Ordem de Serviços</p>
            </button>
          </Link>
        ) : null}
        <Link to='/servicossolicitados'>
          <button type="button" className='botaoMenu'>
            <Icone
              elementoIcone={<ToolOutlined />}
            />
            <p>Ordem de Serviços</p><p>(Abertas)</p>
          </button>
        </Link>
        <Link to=''>
          <button type="button" className='botaoMenu'>
            <Icone
              elementoIcone={<FileDoneOutlined />}
            />
            <p>Ordem de Serviços</p><p>(Fechadas)</p>
          </button>
        </Link>
        {nivelAcesso == 5 || nivelAcesso == 10 ? (
          <Link to='/listapecas'>
            <button type="button" className='botaoMenu'>
              <Icone
                elementoIcone={<ProductOutlined />}
              />
              <p>Peças</p>
            </button>
          </Link>
        ) : null}
        {nivelAcesso == 5 || nivelAcesso == 10 ? (
          <Link to='/listaservicos'>
            <button type="button" className='botaoMenu'>
              <Icone
                elementoIcone={<SnippetsOutlined />}
              />
              <p>Serviços</p>
            </button>
          </Link>
        ) : null}
        {nivelAcesso == 5 || nivelAcesso == 10 ? (
          <Link to='/listatecnicosterceirizadas'>
            <button type="button" className='botaoMenu'>
              <Icone
                elementoIcone={<UsergroupAddOutlined />}
              />
              <p>Meus Técnicos</p>
            </button>
          </Link>
        ) : null}
        {nivelAcesso >= 9 ? (
          <Link to='/listaubs'>
            <button type="button" className='botaoMenu'>
              <Icone
                elementoIcone={<MedicineBoxOutlined />}
              />
              <p>UBS</p>
            </button>
          </Link>
        ) : null}
        <Link to='/listaterceirizadas'>
          <button type="button" className='botaoMenu'>
            <Icone
              elementoIcone={<SolutionOutlined />}
            />
            <p>{capiton}</p>
          </button>
        </Link>
        {nivelAcesso >= 9 ? (
          <Link to='/listaprodutos'>
            <button type="button" className='botaoMenu'>
              <Icone
                elementoIcone={<FileAddOutlined />}
              />
              <p>Produtos / Itens</p>
            </button>
          </Link>
        ) : null}
        <Link to='/logout'>
          <button type="button" className='botaoMenu'>
            <Icone
              elementoIcone={<LogoutOutlined />}
            />
            <p>Sair</p>
          </button>
        </Link>
      </div>
    </>
  )
}