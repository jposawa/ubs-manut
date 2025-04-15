import React from 'react'
import { usuarioLogadoAtom } from '../compartilhados/estados/'
import { useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

export const Logout = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const defineUsuarioLogado = useSetRecoilState(usuarioLogadoAtom)
  const navigate = useNavigate();

  React.useEffect(() => {
    sessionStorage.removeItem('ubs-usuario');
    defineUsuarioLogado(null);
    navigate('/login');
  }, []);
  return (
    <></>   
  )
}
