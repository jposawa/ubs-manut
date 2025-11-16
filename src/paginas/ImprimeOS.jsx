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
    navigate('/login');
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

  const nomeArquivo = 'UBSmanut_OS' + id + '.pdf';
  let lin = 0;
  let nPag = 0;
  let larguraMaxTexto = 192;
  let textoObs = '';
  let textoGestor = '';
  let qtdLinhas = 0;
  const totalSer = dadosServicosOS.reduce((valorAtual, item) => {
      valorAtual += Number(item.valorCobrado);
      return valorAtual
    }, 0)
    const totalServicos = totalSer.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalPec = dadosPecasOS.reduce((valorAtual, item) => {
      valorAtual += Number(item.valorCobrado);
      return valorAtual
    }, 0)
    const totalPecas = totalPec.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const subTotal = (totalSer + totalPec);
    const totalOs = subTotal - Number(dadosImprimirOS?.[0]?.desconto ?? 0);
    console.log({
      totalOs,
      subTotal,
      dadosImprimirOS,
    });
  //////////////////////////////////////////
  const geraPDF_OS = () => {
    ///    inicia propriamente o relatorio PDF
    cabOS_PDF();
    dadosImprimirOS.map((opc) => {
      return (
        <div key={opc.id}>
          {doc.setFontSize(10)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Ordem de Serviço:', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.id.toString().padStart(6, '0'), 41, lin)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Data de abertura:', 65, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(dataDoBanco(opc.dataAberturaOS), 95, lin)}

          {doc.setFont("helvetica", "bold")}
          {doc.text('Data de fechamento:', 125, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(dataDoBanco(opc.dataFechamentoOS), 161, lin)}
          {lin = incrementaLinha(2)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(4)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Unidade atendida: ', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.nomeUbs, 41, lin)}
          {lin = incrementaLinha(2)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Produto/Item : ', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.descricao + ' ' + opc.marca + ' ' + opc.modelo + ' ' + opc.referencia, 34, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Ambiente Instalado: ', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.ambienteInstalado, 44, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Defeito(s) apresentado(s): ', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.defeitoApres, 55, lin)}
          {lin = incrementaLinha(10)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(4)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Solicitante:', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.nomeSolicitante, 30, lin)}
          {lin = incrementaLinha(2)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Serviço(s) realizado(s):', 8, lin)}
          {doc.text('Cod.Interno', 50, lin)}
          {doc.text('Descrição', 75, lin)}
          {doc.text('Valor', 192, lin)}
          {doc.setFont("helvetica", "normal")}
          {lin = incrementaLinha(5)}
          {dadosServicosOS.map((ser, indiceSer) => {
            lin = incrementaLinha(indiceSer * 5);
            return (
              <p key={ser.id}>
                {doc.text(ser.codigoInterno, 70, lin, 0, 0, 'right')}
                {doc.text(ser.pecaServico, 75, lin)}
                {doc.text(ser.valorCobrado, 200, lin, 0, 0, 'right')}
              </p>
            )
          }
          )}
          {lin = incrementaLinha((dadosServicosOS.length + 5))}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Valor total do(s) serviço(s): R$', 8, lin)}
          {doc.text(totalServicos, 200, lin, 0, 0, 'right')}
          {lin = incrementaLinha(5)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Peça(s) substituída(s):', 8, lin)}
          {/*lin = incrementaLinha(5)*/}
          {doc.setFont("helvetica", "normal")}
          {dadosPecasOS.map((pec, indicePec) => {
            lin = lin + (indicePec * 5);
            return (
              <p key={pec.id}>
                {doc.text(pec.codigoInterno, 70, lin, 0, 0, 'right')}
                {doc.text(pec.pecaServico, 75, lin)}
                {doc.text(pec.valorCobrado, 200, lin, 0, 0,'right')}
              </p>
            )
          }
          )}
          {lin = incrementaLinha((dadosPecasOS.length + 5))}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Valor total da(s) peça(s): R$', 8, lin)}
          {doc.text(totalPecas, 200, lin, 0, 0, 'right')}
          {lin = incrementaLinha(5)}
          {doc.line(5, lin, 205, lin)}
          {doc.setFont("helvetica", "bold")}
          {lin = incrementaLinha(5)}
          {doc.text('SUB-TOTAL: R$', 140, lin)}
          {doc.text(`${subTotal}`, 200, lin, 0, 0, 'right')}
          {lin = incrementaLinha(5)}
          {doc.text('DESCONTO: R$', 140, lin)}
          {doc.text(opc.desconto, 200, lin, 0, 0, 'right')}
          {lin = incrementaLinha(7)}
          {doc.text('TOTAL DA O.S.: R$', 134, lin)}
          {doc.text(`${totalOs}`, 200, lin, 0, 0, 'right')}
          {lin = incrementaLinha(5)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Observação:', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {lin = incrementaLinha(5)}
          {textoObs = doc.splitTextToSize(opc.obs, larguraMaxTexto)}
          {qtdLinhas = textoObs.length}
          {doc.text(textoObs, 8, lin)}
          {lin = incrementaLinha((qtdLinhas * 4) + 5)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Status:', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {doc.text('"' + opc.statusOS + '"', 22, lin)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('(A) Aberta    -    (F) Fechada', 40, lin)}
          {lin = incrementaLinha(3)}
          {doc.line(5, lin, 205, lin)}
          {lin = incrementaLinha(5)}
          {doc.setFont("helvetica", "bold")}
          {doc.text('Parecer do responsável pelas manutenções nas UBS:', 8, lin)}
          {doc.setFont("helvetica", "normal")}
          {lin = incrementaLinha(5)}
          {textoGestor = doc.splitTextToSize(opc.parecerGestor, larguraMaxTexto)}
          {qtdLinhas = textoGestor.length}
          {doc.text(textoGestor, 8, lin)}
          {lin = incrementaLinha((qtdLinhas * 4) + 15)}
          {doc.setFont("helvetica", "normal")}
          {doc.text(opc.razaoTerc, 22, lin)}
          {lin = incrementaLinha(5)}
          {doc.text(opc.fantasiaTerc, 22, lin)}

          {doc.text('Responsável pelas manutenções nas UBS', 124, lin)}
        </div >
      )
    })
    doc.save(nomeArquivo);
  }

  const incrementaLinha = (vlr) => {
    lin = lin + vlr;
    if (lin > 255) {
      doc.addPage();
      cabOS_PDF();
    }
    return (lin);
  }

  const cabOS_PDF = () => {
    lin = 0;
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
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    lin = incrementaLinha(11);
    doc.text('Prefeitura Municipal de Iguatu-CE', 66, lin);
    doc.setFontSize(12);
    lin = incrementaLinha(8);
    doc.text('Controle de Manutenções em Unidades Básicas de Saúde', 47, lin);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    lin = incrementaLinha(6);
    doc.text('Iguatu-CE', 94, lin);
    lin = incrementaLinha(6);
    doc.line(5, lin, 205, lin);
    lin = 36;
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