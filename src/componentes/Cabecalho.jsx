import React from "react";
import { useRecoilValue } from "recoil";
import { usuarioLogadoAtom } from "../compartilhados/estados";
import { Logo } from ".";
import axios from "axios";
import { URL_TERCEIRIZADAS } from "../compartilhados/constantes";

export const Cabecalho = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const [dadosTerc, setDadosTerc] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  let nomeUsuario = '';
  let municipio = '';
  let uf = '';
  let hifen = '';
  let idTerceirizada = 0;
  let nomeTerceirizada = '';

  if (usuarioLogado) {
    nomeUsuario = 'Usuário: ' + usuarioLogado.nivelAcesso + '-' + usuarioLogado.login;
    municipio = usuarioLogado.municipio;
    uf = usuarioLogado.uf;
    hifen = '-';
    idTerceirizada = usuarioLogado.idTerceirizada;
  }

  const buscarDadosTerc = () => {
    setLoading(true);
    axios.get(URL_TERCEIRIZADAS, {
      params: {
        opc: 'buscaDadosTerceirizadas',
        idTerc: '',
      }
    })
      .then(response => {
        setDadosTerc(response.data);
        //console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        //    console.error('Erro ao buscar dados:', error);
        setDadosTerc(null);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (!loading && dadosTerc.length === 0) {
      buscarDadosTerc();
    }
  }, []);

  dadosTerc.map((opc) => {
    if (opc.id == idTerceirizada) {
      nomeTerceirizada = opc.fantasia;
    }
  })

  if (usuarioLogado) {
    const nivelAcesso = usuarioLogado.nivelAcesso;
    if (nivelAcesso == 9) {
      nomeTerceirizada = 'Gestor';
    }
    if (nivelAcesso == 10) {
      nomeTerceirizada = 'Acesso geral';
    }
  }
  return (
    <header className="cabecalho">
      <div>
        <Logo />
        <h4>{municipio}{hifen}{uf}</h4>
      </div>
      <div className="dadosCabecalho">
        <h4>Gestor de Manutenções em Unidades Básicas de Saúde</h4>
        <h5>{nomeUsuario}</h5>
        <h5>{nomeTerceirizada}</h5>
      </div>
    </header>
  )
}