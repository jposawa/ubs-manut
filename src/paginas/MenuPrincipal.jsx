import React from "react";
import './EstiloGeral.css';
import { Link, useNavigate } from "react-router-dom";
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { useRecoilValue } from "recoil";
import { FileAddOutlined, FileDoneOutlined, LogoutOutlined, MedicineBoxOutlined, SettingOutlined, ToolOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Icone } from "../componentes";

export const MenuPrincipal = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const navigate = useNavigate();

  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
    if (!usuarioSessao) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <div className='areaMenu'>
        <Link to='/geraros'>
          <button type="button" className='botaoMenu'>
            <Icone
              elementoIcone = {< SettingOutlined/>}
            />
            <p>Gerar O.S</p>
          </button>
        </Link>
       
      </div>
      <div className='areaMenu'>
        <Link to='/servicossolicitados'>
          <button type="button" className='botaoMenu'>
            <Icone 
            elementoIcone = {<ToolOutlined />}
            />
            <p>Serviços Solicitados</p>
          </button>
        </Link>
        <button type="button" className='botaoMenu'>
          <Icone 
            elementoIcone = {<FileDoneOutlined />}
          />
          <p>Serviços Realizados</p>
        </button>
      </div>
      <div className='areaMenu'>
        <Link to='/listaubs'>
          <button type="button" className='botaoMenu'>
            <Icone 
              elementoIcone = {<MedicineBoxOutlined />}
            />
            <p>UBS</p>
          </button>
        </Link>
        <Link to='/listaterceirizadas'>
          <button type="button" className='botaoMenu'>
            <Icone 
              elementoIcone = {<UsergroupAddOutlined />}
            />
            <p>Terceirizadas</p>
          </button>
        </Link>
      </div>
      <div className='areaMenu'>
        <Link to='/listaprodutos'>
          <button type="button" className='botaoMenu'>
            <Icone 
              elementoIcone = {<FileAddOutlined />}
            />
            <p>Produtos/Itens</p>
          </button>
        </Link>
        <Link to='/logout'>
          <button type="button" className='botaoMenu'>
            <Icone 
              elementoIcone = {<LogoutOutlined />}
            />
            <p>Sair</p>
          </button>
        </Link>
      </div>
    </>
  )
}