import pool from "../config/db.js";

const setores = [
  { nome: "Informática", criado_por: "Rafael Barth", codigo_entrada: "INF123X9", imagem_perfil: "/Logo.png" },
  { nome: "Financeiro", criado_por: "Henrique Guimarães", codigo_entrada: "FNC244M7", imagem_perfil: "/img/perfil_financeiro.png" },
  { nome: "Gabinete Gilvan", criado_por: "Sistema", codigo_entrada: "GBG123A1", imagem_perfil: "/img/gilvan.jpg" },
  { nome: "Gabinete PC", criado_por: "Sistema", codigo_entrada: "GBC245B2", imagem_perfil: "/img/perfil_gab_pc.png" },
  { nome: "Gabinete Claudio", criado_por: "Sistema", codigo_entrada: "GBC367C3", imagem_perfil: "/img/claudio.jpg" },
  { nome: "Gabinete Tati", criado_por: "Sistema", codigo_entrada: "GBT489D4", imagem_perfil: "/img/perfil_gab_tati.png" },
  { nome: "Gabinete Rose", criado_por: "Sistema", codigo_entrada: "GBR501E5", imagem_perfil: "/img/perfil_gab_rose.png" },
  { nome: "Gabinete Patrick", criado_por: "Sistema", codigo_entrada: "GBP623F6", imagem_perfil: "/img/perfil_gab_patrick.png" },
  { nome: "Gabinete Adriano", criado_por: "Sistema", codigo_entrada: "GBA745G7", imagem_perfil: "/img/perfil_gab_adriano.png" },
  { nome: "Gabinete Chines", criado_por: "Sistema", codigo_entrada: "GBC867H8", imagem_perfil: "/img/perfil_gab_chines.png" },
  { nome: "Gabinete Esporinha", criado_por: "Sistema", codigo_entrada: "GBE989I9", imagem_perfil: "/img/esporinha.png" },
  { nome: "Gabinete Giovane", criado_por: "Sistema", codigo_entrada: "GBG111J1", imagem_perfil: "/img/perfil_gab_giovane.png" },
  { nome: "Gabinete Paula", criado_por: "Sistema", codigo_entrada: "GBP222K2", imagem_perfil: "/img/perfil_gab_paula.png" },
  { nome: "Gabinete Wilson", criado_por: "Sistema", codigo_entrada: "GBW333L3", imagem_perfil: "/img/perfil_gab_wilson.png" },
  { nome: "Comissões", criado_por: "Sistema", codigo_entrada: "COM444M4", imagem_perfil: "/img/perfil_comissoes.png" },
  { nome: "Diretoria", criado_por: "Sistema", codigo_entrada: "DIR555N5", imagem_perfil: "/img/perfil_diretoria.png" },
  { nome: "Secretaria Geral", criado_por: "Sistema", codigo_entrada: "SEC666O6", imagem_perfil: "/img/perfil_secretaria.png" },
  { nome: "Recepção", criado_por: "Sistema", codigo_entrada: "REC777P7", imagem_perfil: "/img/perfil_recepcao.png" },
];

const perfis = [
  { nome: "Rafael Barth", setorId: 1 },
  { nome: "Nilton Souza", setorId: 1 },
  { nome: "Igor", setorId: 1 },
  { nome: "Vitor", setorId: 1 },
  { nome: "Henrique", setorId: 1 },
  { nome: "Renan", setorId: 1 },
  { nome: "Luan", setorId: 1 },
  { nome: "Marshella", setorId: 2 },
  { nome: "Gilvan", setorId: 3 },
  { nome: "Eric", setorId: 3 },
  { nome: "Paulo César", setorId: 4 },
  { nome: "Claudio", setorId: 5 },
  { nome: "Liane", setorId: 5 },
  { nome: "Renata", setorId: 5 },
  { nome: "Cinara", setorId: 5 },
  { nome: "Lucas", setorId: 5 },
  { nome: "Manuela", setorId: 5 },
  { nome: "Tatiane", setorId: 6 },
  { nome: "Rose", setorId: 7 },
  { nome: "Patrick", setorId: 8 },
  { nome: "Adriano", setorId: 9 },
  { nome: "Chinês", setorId: 10 },
  { nome: "Esporinha", setorId: 11 },
  { nome: "Giovane", setorId: 12 },
  { nome: "Paula", setorId: 13 },
  { nome: "Wilson", setorId: 14 },
  { nome: "Talles", setorId: 16 },
  { nome: "Adriana", setorId: 17 },
];

const chamados = [
  {
    titulo: "Computador não liga",
    descricaoProblema: "O computador da recepção não liga mesmo após reiniciar o estabilizador.",
    setorId: 1,
    perfilId: 5,
    imagens: ["/img/chamados/comp1.png"],
  },
  {
    titulo: "Problema no Telefone",
    descricaoProblema: "Sistema de ponto apresenta erro ao exportar planilha.",
    setorId: 5,
    perfilId: 2,
    imagens: ["/img/chamados/tel1.png", "/img/chamados/tel2.png"],
  },
];

async function initDatabase() {
  const conn = await pool.getConnection();
  try {
    console.log("🧩 Inicializando banco...");

    await conn.query("CREATE DATABASE IF NOT EXISTS helpdesk;");
    await conn.query("USE helpdesk;");

    await conn.query(`
      CREATE TABLE IF NOT EXISTS setores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        criado_por VARCHAR(100),
        codigo_entrada VARCHAR(20) UNIQUE NOT NULL,
        imagem_perfil VARCHAR(255)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS perfis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        setorId INT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (setorId) REFERENCES setores(id) ON DELETE CASCADE
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricaoProblema TEXT NOT NULL,
        descricaoTI TEXT,
        status VARCHAR(50) DEFAULT 'NAO RESOLVIDO',
        visualizadoTI BOOLEAN DEFAULT FALSE,
        fechado BOOLEAN DEFAULT FALSE,
        dataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
        imagens JSON,
        setorId INT NOT NULL,
        perfilId INT NOT NULL,
        FOREIGN KEY (setorId) REFERENCES setores(id),
        FOREIGN KEY (perfilId) REFERENCES perfis(id)
      );
    `);

    console.log("✅ Tabelas criadas/verificadas.");

    // Inserir setores se estiverem vazios
    const [countSetores] = await conn.query("SELECT COUNT(*) AS total FROM setores;");
    if (countSetores[0].total === 0) {
      await conn.query("INSERT INTO setores (nome, criado_por, codigo_entrada, imagem_perfil) VALUES ?", [
        setores.map(s => [s.nome, s.criado_por, s.codigo_entrada, s.imagem_perfil]),
      ]);
      console.log("📦 Setores inseridos!");
    }

    // Inserir perfis se estiverem vazios
    const [countPerfis] = await conn.query("SELECT COUNT(*) AS total FROM perfis;");
    if (countPerfis[0].total === 0) {
      await conn.query("INSERT INTO perfis (nome, setorId) VALUES ?", [
        perfis.map(p => [p.nome, p.setorId]),
      ]);
      console.log("👤 Perfis inseridos!");
    }

    // Inserir chamados se estiverem vazios
    const [countChamados] = await conn.query("SELECT COUNT(*) AS total FROM chamados;");
    if (countChamados[0].total === 0) {
      await conn.query("INSERT INTO chamados (titulo, descricaoProblema, setorId, perfilId, imagens) VALUES ?", [
        chamados.map(c => [c.titulo, c.descricaoProblema, c.setorId, c.perfilId, JSON.stringify(c.imagens)]),
      ]);
      console.log("📞 Chamados inseridos!");
    }

    console.log("🏁 Banco pronto para uso!");
  } catch (err) {
    console.error("Erro ao inicializar o banco:", err);
  } finally {
    conn.release();
  }
}

export default initDatabase;
