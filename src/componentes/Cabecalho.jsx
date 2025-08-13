import { useRecoilValue } from "recoil";
import { LOGO_UBS } from "../compartilhados/constantes"
import { usuarioLogadoAtom } from "../compartilhados/estados";

export const Cabecalho = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  let nomeUsuario = '';
  if (usuarioLogado) {
    nomeUsuario = 'Usuário: ' + usuarioLogado.login;
  }
  return (
    <header className="cabecalho">
      <div>
        <img src={LOGO_UBS} />
        <h4>Iguatu-CE</h4>
      </div>
      <div className="dadosCabecalho">
        <h4>Gestor de Manutenções de Unidades Básicas de Saúde</h4>
        <h5>{nomeUsuario}</h5>
      </div>
    </header>
  )
}