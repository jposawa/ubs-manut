export * from "./unidades";

export const LOGO_UBS = 'src/imagens/UBSLogo1.png';
export const URL_FOTOS_UBS = 'https://datasystem-ce.com.br/ubsManut/fotos/';
export const URL_LOGIN_UBS = 'https://datasystem-ce.com.br/ubsManut/api_ubs_login.php';
export const URL_TERCEIRIZADAS = 'https://datasystem-ce.com.br/ubsManut/api_ubs_terceirizadas.php';
export const URL_UBS = 'https://datasystem-ce.com.br/ubsManut/api_ubs_cadastros_ubs.php';
export const URL_OS = "https://datasystem-ce.com.br/ubsManut/api_ubs_os.php";
export const URL_PRODUTOS = "https://datasystem-ce.com.br/ubsManut/api_ubs_produtos.php";
export const URL_PECAS = "https://datasystem-ce.com.br/ubsManut/api_ubs_pecas.php";
export const URL_SERVICOS = "https://datasystem-ce.com.br/ubsManut/api_ubs_servicos.php";

export const SITUACAO_USUARIOS = {
  ATIVO: "A",
  IRREGULARES: "I",
  FALECIDOS: "F"
}

export const TIT_LISTA_MEMBROS = {
  A: "Ativos",
  I: "Irregulares",
  F: "Falecidos"
}

export const PREFIXO = "ubs";

export const MENSAGEM_ERRO = {
  LOGIN: "Favor efetuar login novamente",
};

/*export const AMBIENTE = process.env.REACT_APP_AMBIENTE ?? "test";*/