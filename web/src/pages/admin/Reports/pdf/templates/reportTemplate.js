import { styles } from './styles.js';

/**
 * Constrói a definição do documento PDF
 * @param {Object} data - Dados do relatório (summary, departments, agents, tickets)
 * @param {Object} filters - Filtros aplicados (startDate, endDate, departments, agents, search)
 * @returns {Object} Definição do documento para o pdfmake
 */
export function buildReportDefinition(data, filters) {
  const { summary, departments, agents, tickets } = data;
  const { startDate, endDate, departments: deptIds, agents: agentIds, search } = filters;

  const content = [];

  // ---------- Cabeçalho ----------
  content.push({
    text: 'RELATÓRIO DE CHAMADOS',
    style: 'header',
  });

  content.push({
    text: `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    style: 'subheader',
  });

  // ---------- Filtros aplicados ----------
  const filterLines = [];
  if (startDate) filterLines.push(`Data inicial: ${new Date(startDate).toLocaleString('pt-BR')}`);
  if (endDate) filterLines.push(`Data final: ${new Date(endDate).toLocaleString('pt-BR')}`);
  if (deptIds && deptIds.length) filterLines.push(`Setores: ${deptIds.join(', ')}`);
  if (agentIds && agentIds.length) filterLines.push(`Técnicos: ${agentIds.join(', ')}`);
  if (search) filterLines.push(`Busca: "${search}"`);

  if (filterLines.length) {
    content.push({
      text: 'Filtros aplicados:',
      style: 'sectionTitle',
    });
    content.push({
      ul: filterLines,
      fontSize: 10,
      margin: [0, 0, 0, 10],
    });
  }

  // ---------- Resumo Geral (cards) ----------
  content.push({
    text: 'Resumo Geral',
    style: 'sectionTitle',
  });

  content.push({
    layout: 'lightHorizontalLines',
    table: {
      widths: ['*', '*', '*'],
      body: [
        [
          { text: 'Total', style: 'tableHeader', alignment: 'center' },
          { text: 'Abertos', style: 'tableHeader', alignment: 'center' },
          { text: 'Fechados', style: 'tableHeader', alignment: 'center' },
        ],
        [
          { text: summary.total, style: 'tableRow', alignment: 'center' },
          { text: summary.abertos, style: 'tableRow', alignment: 'center' },
          { text: summary.fechados, style: 'tableRow', alignment: 'center' },
        ],
      ],
    },
  });

  // ---------- Chamados por Setor ----------
  if (departments && departments.length) {
    content.push({
      text: 'Chamados por Setor',
      style: 'sectionTitle',
    });
    content.push({
      layout: 'lightHorizontalLines',
      table: {
        widths: ['*', 'auto'],
        body: [
          [
            { text: 'Setor', style: 'tableHeader' },
            { text: 'Total', style: 'tableHeader', alignment: 'center' },
          ],
          ...departments.map((d, index) => [
            { text: d.nome, style: index % 2 === 0 ? 'tableRow' : 'tableRowAlternate' },
            { text: d.total, style: index % 2 === 0 ? 'tableRow' : 'tableRowAlternate', alignment: 'center' },
          ]),
        ],
      },
    });
  }

  // ---------- Resolvidos por Técnico ----------
  if (agents && agents.length) {
    content.push({
      text: 'Resolvidos por Técnico',
      style: 'sectionTitle',
    });
    content.push({
      layout: 'lightHorizontalLines',
      table: {
        widths: ['*', 'auto'],
        body: [
          [
            { text: 'Técnico', style: 'tableHeader' },
            { text: 'Resolvidos', style: 'tableHeader', alignment: 'center' },
          ],
          ...agents.map((a, index) => [
            { text: a.nome, style: index % 2 === 0 ? 'tableRow' : 'tableRowAlternate' },
            { text: a.resolvidos, style: index % 2 === 0 ? 'tableRow' : 'tableRowAlternate', alignment: 'center' },
          ]),
        ],
      },
    });
  }

  // ---------- Lista de Chamados (tickets) ----------
  if (tickets && tickets.length) {
    content.push({
      text: 'Lista de Chamados',
      style: 'sectionTitle',
    });
    content.push({
      layout: 'lightHorizontalLines',
      table: {
        // Ajustando larguras para melhor distribuição
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
        body: [
          [
            { text: 'ID', style: 'tableHeader' },
            { text: 'Título', style: 'tableHeader' },
            { text: 'Setor', style: 'tableHeader' },
            { text: 'Status', style: 'tableHeader' },
            { text: 'Abertura', style: 'tableHeader' },
            { text: 'Fechamento', style: 'tableHeader' },
            { text: 'Técnico', style: 'tableHeader' },
          ],
          ...tickets.map((t, index) => {
            const rowStyle = index % 2 === 0 ? 'tableRow' : 'tableRowAlternate';
            return [
              { text: `#${t.id}`, style: rowStyle },
              { text: t.titulo || '', style: rowStyle },
              { text: t.setorNome || '—', style: rowStyle },
              {
                text: t.fechado === 1 ? 'Fechado' : (t.status === 'EM ANDAMENTO' ? 'Em andamento' : 'Não visualizado'),
                style: rowStyle,
              },
              { text: new Date(t.dataHora).toLocaleString('pt-BR'), style: rowStyle },
              { text: t.fechado === 1 ? new Date(t.dataFechamento).toLocaleString('pt-BR') : '—', style: rowStyle },
              { text: t.finalizadoPorNome || '—', style: rowStyle },
            ];
          }),
        ],
      },
    });
  }

  // ---------- Rodapé ----------
  content.push({
    text: `Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`,
    fontSize: 8,
    color: '#94a3b8',
    alignment: 'center',
    margin: [0, 20, 0, 0],
  });

  return {
    content,
    styles,
    defaultStyle: {
      font: 'Lato', // ou 'Lato', dependendo da sua configuração
      fontSize: 10,
      color: '#1e293b',
    },
  };
}
