import React from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { URL_OS } from '../compartilhados/constantes';
import { useNavigate, useParams } from 'react-router-dom';

export const ImprimeOS = () => {
  const { id } = useParams();
  const [dadosImprimirOS, setDadosImprimirOS] = React.useState([]);
  const navigate = useNavigate();
  const usuarioSessao = JSON.parse(sessionStorage.getItem('ubs-usuario'));
  if (!usuarioSessao) {
    navigate('/servicossolicitados');
  }
  const nivelAcesso = usuarioSessao.nivelAcesso;
  React.useEffect(() => {
    axios.get(URL_OS, {
      params: {
        opc: 'buscaDadosImprimirOS',
        idOS: id
      }
    }).then((resposta) => {
      setDadosImprimirOS(resposta.data);
      console.log(resposta.data);
    }).catch((erro) => {
      toast.error('Nenhum movimento encontrado !');
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /// variaveis comuns para cabecalho, corpo e rodape
  const doc = new jsPDF('p', 'mm', 'a4');
  const mesesAbreviados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const nomeArquivo = 'os_' + id + '.pdf';
  let lin = 60;
  let nPag = 0;
  //////////////////////////////////////////
  const geraPDF = () => {
    ///    inicia propriamente o relatorio PDF
    cabPDF();
    dadosImprimirOS.map((opc) => {
      lin = lin + 6;
      if (lin > 255) {
        lin = 47;
        doc.addPage();
        cabPDF();
      }

      return (
        <li key={opc.id}>
          {doc.text(opc.dataMovimento.substr(8, 2), 7, lin)}
          {doc.line(13, lin - 4, 13, lin + 2)}
          {doc.text(caixa.historicoPadrao.substr(0, 34), 14, lin)}
          {doc.line(89, lin - 4, 89, lin + 2)}
          {caixa?.idHistorico == 1 ? (
            doc.text([caixa.nomeMembro.substr(0, 32)], 90, lin),
            doc.line(157, lin - 4, 157, lin + 2),
            doc.line(179, lin - 4, 179, lin + 2),
            lin = lin + 5,
            doc.text(('(Ref. mês: ' + caixa.mesAno + ')'), 90, lin),
            doc.line(13, lin - 4, 13, lin + 2),
            doc.line(89, lin - 4, 89, lin + 2),
            doc.line(157, lin - 4, 157, lin + 2),
            doc.line(179, lin - 4, 179, lin + 2))
            : doc.text([caixa.complemento.substr(0, 32)], 90, lin)
            [doc.line(157, lin - 4, 157, lin + 2),
            doc.line(179, lin - 4, 179, lin + 2)]
          }
          {caixa?.statusLancamento == "D" ? (
            doc.line(179, lin - 4, 179, lin + 2),
            doc.text(toMoneyBr(caixa.valor), 177, lin, { align: 'right' })
          ) : doc.text('------', 171, lin, { align: 'center' })}
          {caixa?.statusLancamento == "C" ? (
            doc.text(toMoneyBr(caixa.valor), 204, lin, { align: 'right' })
          ) : doc.text('------', 198, lin, { align: 'center' })}
          {doc.line(5, lin + 2, 205, lin + 2)}
        </li >
      )
    })
  }
  doc.save(nomeArquivo);


  const cabPDF = () => {
    doc.setDisplayMode('fullwidth', 'single');
    doc.setDrawColor(0, 10, 0) // bordas e lines cinza
    //doc.setPage();
    doc.setLineWidth(0.1);
    doc.rect(5, 5, 200, 285);
    //// faz o rodape
    //const tPag = doc.getNumberOfPages();// getPageInfo(1).pageNumber;
    nPag = doc.getNumberOfPages();
    doc.setFontSize(7);
    doc.text('Impresso por Sistemas Web - (11) 9 6769-3975 - Todos os Direitos Reservados', 90, 293);
    doc.text('Página: ' + nPag, 190, 293);
    ////// fim rodape
    doc.addImage(LOGO_CAPITULO, 6, 6, 30, 30);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(NOME_CAPITULO, 65, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(POTENCIA_CAPITULO, 65, 20);
    doc.text(CIDADE_CAPITULO, 91, 28);
    doc.text('Relatório de Fluxo de Caixa', 77, 35);
    // doc.rect(172, 5, 33, 32);
    doc.addImage(LOGO_POTENCIA, 174, 6, 30, 30);
    doc.line(5, 37, 205, 37);
    doc.setFontSize(10);
    doc.text('Conta: ' + [nomeConta], 37, 35);
    doc.text('Mês: ' + [mesSel], 152, 35);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.line(5, 43, 205, 43);//col,lin,col,lin
    { doc.setFillColor('#87CEEB') }
    { doc.rect(5.1, lin - 3.9, 199.8, 5.8, 'F') }
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
  }
}

