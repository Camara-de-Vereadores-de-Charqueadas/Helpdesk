import pdfMake from 'pdfmake/build/pdfmake';
import { buildReportDefinition } from './templates/reportTemplate';

pdfMake.addFonts({
    Lato: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf',
    }
});

/**
 * Gera o PDF e dispara o download
 * @param {Object} data - Dados do relatório (summary, departments, agents, tickets)
 * @param {Object} filters - Filtros aplicados (startDate, endDate, departments, agents, search)
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function generateAndDownloadPDF(data, filters, filename = 'relatorio.pdf') {
  const docDefinition = buildReportDefinition(data, filters);
  pdfMake.createPdf(docDefinition).download(filename);
}
