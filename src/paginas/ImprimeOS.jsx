import React from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { URL_OS } from '../compartilhados/constantes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { dataAtual, dataDoBanco, formatarValor } from '../compartilhados/funcoes';
import './EstiloGeral.css';

export const ImprimeOS = () => {
  const { id } = useParams();
  const [dadosImprimirOS, setDadosImprimirOS] = React.useState([]);
  const [dadosServicosOS, setDadosServicosOS] = React.useState([]);
  const [dadosPecasOS, setDadosPecasOS] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/servicossolicitados');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  React.useEffect(() => {
    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosServicosSol',
        idOS: id,
        status: 'A'
      }
    }).then((resposta) => {
      setDadosImprimirOS(resposta?.data ?? []);
    }).catch((erro) => {
      toast.error('Nenhum movimento encontrado !');
    })

    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosServicosOS',
        idOS: id,
        status: 'A'
      }
    }).then((resposta) => {
      setDadosServicosOS(resposta?.data ?? []);
      console.log(resposta.data);
    }).catch((erro) => {
      toast.error('Nenhum movimento encontrado !');
    })

    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosPecasOS',
        idOS: id,
        status: 'A'
      }
    }).then((resposta) => {
      setDadosPecasOS(resposta.data);
      console.log(resposta.data);
    }).catch((erro) => {
      toast.error('Nenhum movimento encontrado !');
    })

  }, []);

  /// variaveis comuns para cabecalho, corpo e rodape
  const doc = new jsPDF('p', 'mm', 'a4');

  const mesesAbreviados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const nomeArquivo = 'UBSmanut_OS' + id + '.pdf';
  let lin = 47;
  let nPag = 0;
  //////////////////////////////////////////
  const geraPDF_OS = () => {
    ///    inicia propriamente o relatorio PDF
    cabOS_PDF();
    dadosImprimirOS.map((opc) => {
      lin = lin + 6;
      if (lin > 255) {
        lin = 47;
        doc.addPage();
        cabOS_PDF();
      }

      return (
        <div key={opc.id}>
          {doc.setFillColor('#87CEEB')}
          {doc.rect(5.1, 31.1, 199.8, 5.8, 'F')}
          {doc.setFontSize(10)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Ordem de Serviço:', 8, 35)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.id.toString().padStart(6, '0'), 41, 35)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Data de abertura:', 65, 35)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(dataDoBanco(opc.dataAberturaOS), 95, 35)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Data de fechamento:', 125, 35)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(dataDoBanco(opc.dataFechamentoOS), 161, 35)}

          {doc.line(5, 37, 205, 37)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Nome UBS: ', 8, 41)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.nomeUbs, 30, 41)}

          {doc.line(5, 43, 205, 43)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Produto/Item : ', 8, 48)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.descricao + ' ' + opc.marca + ' ' + opc.modelo + ' ' + opc.referencia, 34, 48)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Ambiente Instalado: ', 8, 53)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.ambienteInstalado, 44, 53)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Defeito(s) apresentado(s): ', 8, 58)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.defeitoApres, 55, 58)}

          {doc.line(5, 68, 205, 68)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Solicitante:', 8, 72)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.nomeSolicitante, 30, 72)}

          {doc.line(5, 74, 205, 74)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Serviço(s) realizado(s):', 8, 79)}
          {doc.setFont("helvetica", "normal")}
          {doc.text('Cod.Interno', 50, 79)}
          {doc.text('Descrição do serviço', 70, 79)}
          {doc.text('Valor', 170, 79)}
          {dadosPecasOS.map((ser, indicePeca) => {
            lin = lin + 6;
            if (lin > 255) {
              lin = 47;
              doc.addPage();
              cabOS_PDF();
            }
            else {
              lin = 84 + (indicePeca * 5);
            }
            return (
              <p key={ser.id}>
                {doc.text(ser.codigoInterno, 50, lin)}
                {doc.text(ser.pecaServico, 70, lin)}
                {doc.text(ser.valorCobrado, 170, lin)}
              </p>
            )
          }
          )}

          {doc.line(5, lin + dadosPecasOS.length + 5, 205, lin + dadosPecasOS.length + 5)}

          {/* {doc.setFont("helvetica", "bold")} */}
          {doc.text('Peça(s) substituída(s) e/ou reparada(s):', 8, 101, {
            color: "#00ffff"
          })}
          {doc.setFont("helvetica", "normal")}
          {/*doc.text(opc.pecaSubstReparada, 78, 101)*/}

          {doc.line(5, 119, 205, 119)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Valor do(s) serviço(s): R$', 8, 124)}
          {doc.setFont("helvetica", "normal")}
          {/*doc.text(opc.valorServico, 55, 124)*/}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Valor da(s) peça(s): R$', 80, 124)}
          {doc.setFont("helvetica", "normal")}
          {/*doc.text(opc.valorPecas, 122, 124)*/}

          {doc.line(5, 127, 205, 127)}

          {doc.setFillColor('#87CEEB')}
          {doc.rect(5.1, 127.1, 199.8, 7.8, 'F')}
          {doc.setFont("helvetica", "bold")}
          {doc.text('TOTAL DA O.S.: R$', 8, 132)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.valorTotalOs, 43, 132)}

          {doc.line(5, 135, 205, 135)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Observação:', 8, 140)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.obs, 32, 140)}

          {doc.line(5, 157, 205, 157)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Status:', 8, 162)}
          {doc.setFont("helvetica", "normal")}
          {doc.text('"' + opc.statusOS + '"', 22, 162)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('(A) Aberta    -    (F) Fechada', 40, 162)}

          {doc.line(5, 165, 205, 165)}
          {doc.setFont("helvetica", "normal")}
          {doc.text('Parecer do responsável pelas manutenções nas UBS:', 8, 170)}

          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.razaoTerc, 22, 280)}
          {doc.text(opc.fantasiaTerc, 22, 285)}

          {doc.text('Responsável pelas manutenções nas UBS', 124, 285)}
        </div >
      )
    })
    doc.save(nomeArquivo);
  }

  const incrementaLinha = (somar) => {
    lin = lin + somar;
    return(lin);
  }
  
  const cabOS_PDF = () => {
    doc.setDisplayMode('fullwidth', 'single');
    doc.setDrawColor(0, 10, 0) // bordas e lines cinza
    //doc.setPage();
    doc.setLineWidth(0.1);
    doc.rect(5, 5, 200, 285);
    //// faz o rodape
    //const tPag = doc.getNumberOfPages();// getPageInfo(1).pageNumber;
    nPag = doc.getNumberOfPages();
    doc.setFontSize(7);
    doc.text('Impresso em ' + dataAtual() + ' por Sistemas Web - (11) 9 6769-3975 - Eduardo - Todos os Direitos Reservados.', 55, 293);
    doc.text('Página: ' + nPag, 190, 293);
    ////// fim rodape
    //    doc.rect(5, 5, 38, 32);
    //    doc.addImage('imagens/UBSIcone.JPG', "JPEG", 6, 6, 120, 100);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Prefeitura Municipal de Iguatu-CE', 66, 12);
    doc.setFontSize(12);
    doc.text('Controle de Manutenções em Unidades Básicas de Saúde', 47, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text('Iguatu-CE', 94, 26);

    //    doc.rect(167, 5, 38, 32);
    //doc.addImage('Logo da Prefeitura', 174, 6, 30, 30);
    doc.line(5, 31, 205, 31);
    // doc.setFontSize(10);
    /*  doc.text('Conta: ' + [nomeConta], 37, 35);
      doc.text('Mês: ' + [mesSel], 152, 35);
      */
    /*
     doc.setFontSize(12);
     doc.setFont("helvetica", "bold");
     doc.line(5, 43, 205, 43);//col,lin,col,lin
     {doc.setFillColor('#87CEEB')}
          {doc.rect(5.1, lin - 3.9, 199.8, 5.8, 'F')}
          doc.text('Dia', 6, 41);
          doc.text('Descrição do lançamento', 14, 41);
          doc.text('Complemento', 90, 41);
          doc.text('Débito', 165, 41);
          doc.text('Crédito', 189, 41);
          doc.line(13, 37, 13, 43);
          doc.line(89, 37, 89, 43);
          doc.line(157, 37, 157, 43);
          doc.line(179, 37, 179, 43);
          doc.setFont("helvetica", "normal");
          */
  }

  return (
    <>
      <h2>Gerar Arquivo PDF da O.S.</h2>
      <div className='containerGerarPDF_OS'>
        <p>
          Ao confirmar será gerado um arquivo no formato PDF com a Ordem de Serviço selecionada.
        </p>
        <p>
          A impressão irá depender do aplicativo instalado em seu aparelho  para tal função.
        </p>
      </div>
      <div className='menuRodapePaginas'>
        <Link to='/servicossolicitados'>
          <button className='botoesMenuRodape' type="reset" >Cancelar
          </button>
        </Link>
        <button className='botoesMenuRodape' type="button" onClick={geraPDF_OS}>Gerar PDF
        </button>
      </div>
    </>
  );
}