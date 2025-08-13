import React from 'react'
import axios from 'axios'
import { usuarioLogadoAtom } from '../compartilhados/estados/'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { URL_LOGIN_UBS } from '../compartilhados/constantes'
import { IoMdLogIn } from "react-icons/io";

export const Login = () => {
  const usuarioLogado = useRecoilValue(usuarioLogadoAtom);
  const defineUsuarioLogado = useSetRecoilState(usuarioLogadoAtom)
  const navigate = useNavigate();

  const efetuarAcesso = (event) => {
    event.preventDefault(); // para nao dar o refresh
    const { target } = event; // pegar os inputs
    const valorlogin = target.login.value; // pega os valores inputs
    const valorsenha = target.senha.value;
    axios.get(URL_LOGIN_UBS, {
      params: { // para POST nao precisa do 'params'
        login: valorlogin,
        senha: valorsenha,
      }
    }).then((resposta) => {
      defineUsuarioLogado(resposta.data)
      sessionStorage.setItem('ubs-usuario', JSON.stringify(resposta.data));
    //  console.log(resposta.data);
      navigate('/menuprincipal');
    }).catch((erro) => {
      toast.error("Usuário ou senha inválida !")
    //  console.error('Erro no acesso:', erro);
      navigate('/login');
    })
  }
  React.useEffect(() => {
    const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'))
      if (!usuarioLogado || !usuarioSessao) {
        navigate('/login');
      }
      else {
        navigate('/menuprincipal');
      }
  }, []);
  return (
    <>
      <div className='containerForm'>
        <form className='formLogin' onSubmit={efetuarAcesso}>
          <div className='containerInputsLogin'>
            <div>
              <p>Usuário</p>
              <input type="text" name="login" maxLength="20" required />
            </div>
            <label>
              <p>Senha</p>
              <input type="password" name="senha" required />
            </label>
          </div>
          <div>
            <button type="submit" className='botaoAcessar'>
              <IoMdLogIn />
              Acessar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
