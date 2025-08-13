import CaminhoLogo from "../imagens/UBSLogo.png";

export const Logo = (props) => {
  const { className = "", style } = props;

  return (
    <img src={CaminhoLogo} className={className} style={style} alt="Logo site UBS" />
  )
}