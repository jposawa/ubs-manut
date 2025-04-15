import { atom } from "recoil";
import { SITUACAO_USUARIOS } from "../constantes";

export const usuarioLogadoAtom = atom({
  key:'ubs-usuario',
  default: null
})
export const situacaoMembroAtom = atom({
  key:'ubs-situacaoUsuario',
  default: SITUACAO_USUARIOS.ATIVO,
})