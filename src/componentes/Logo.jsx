import CaminhoLogo from "../imagens/UBSLogo1.png";

export const Logo = (props) => {
  const { className = "", style } = props;

  return (
    <img src={CaminhoLogo} className={className} style={style} alt="Logo site UBS" />
  )
}