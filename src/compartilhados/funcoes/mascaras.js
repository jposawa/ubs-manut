export const formatarTelefone = (event) => {
  const elemento = event.target;
  /**
   * Diferença entre @const e @let é que a variável @const não pode ter seu valor alterado depois
   */
  let valor = elemento.value;
  valor = valor.replace(/\D/g, "");   //Remove tudo o que não é dígito
  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  valor = valor.replace(/(\d)(\d{8})$/, "$1 $2");//Coloca espaço apos primeiro numero (9) do corpo principal 
  valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");//Coloca hífen entre o quarto e o quinto dígitos

  elemento.value = valor;
}

export const formatarCPF = (event) => {
  // A linha 16 faz a mesma coisa que a linha 2
  const { target: elemento } = event;
  let valor = elemento.value;
  valor = valor.replace(/\D/g, "");   //Remove tudo o que não é dígito
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  elemento.value = valor;
}

export const formatarData = (event) => {
  const elemento = event.target;
  let valor = elemento.value;
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{2})(\d)/g, "$1/$2");
  valor = valor.replace(/(\d)(\d{4})$/, "$1/$2");
  elemento.value = valor;
}

export const formatarCep = (event) => {
  const elemento = event.target;
  let valor = elemento.value;
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{5})(\d)/g, "$1-$2");
  elemento.value = valor;
}

export const dataDoBanco = (data) => {
  let dataBr = data.split('-').reverse().join('/');
  return dataBr;
}
export const dataParaBanco = (data) => {
  let dataUs = data.split('/').reverse().join('-');
  return dataUs;
}

export const formatarValor = (event) => {
  const elemento = event.target;
  let valor = elemento.value;
  valor = valor.toString().replace(/\D/g, "");
  valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
  valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
  valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
  elemento.value = valor;
}

export const toMoneyBr = (valor) => {
  return (valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
}
