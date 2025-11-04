// Dados de exemplo para os setores
const setores = [
    {
        id: 1,
        nome: "Informática",
        criadoEm: "2024-10-28",
        criadoPor: "Rafael Barth",
        codigoEntrada: "INF123X9",
        imagemPerfil: "/Logo.png",
        perfis: [
            { id: 1, nome: "Rafael Barth" },
            { id: 2, nome: "Nilton Souza" },
            { id: 3, nome: "Igor" },
            { id: 4, nome: "Vitor" },
            { id: 5, nome: "Henrique" },
            { id: 6, nome: "Renan" },
            { id: 7, nome: "Luan" }
        ]
    },
    {
        id: 2,
        nome: "Financeiro",
        criadoEm: "2024-10-28",
        criadoPor: "Henrique Guimarães",
        codigoEntrada: "FNC244M7",
        imagemPerfil: "/img/perfil_financeiro.png",
        perfis: [{ id: 1, nome: "Marshella" }]
    },
    {
        id: 3,
        nome: "Gabinete Gilvan",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBG123A1",
        imagemPerfil: "/img/gilvan.jpg",
        perfis: [
            { id: 1, nome: "Gilvan" },
        ]
    },
    {
        id: 4,
        nome: "Gabinete PC",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBC245B2",
        imagemPerfil: "/img/perfil_gab_pc.png",
        perfis: [

        ]
    },
    {
        id: 5,
        nome: "Gabinete Claudio",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBC367C3",
        imagemPerfil: "/img/claudio.jpg",
        perfis: [
            { id: 1, nome: "Claudio" },
            { id: 2, nome: "Liane" },
            { id: 3, nome: "Renata" },
            { id: 4, nome: "Cinara" },
            { id: 5, nome: "Lucas" },
            { id: 6, nome: "Manuela" },
        ]
    },
    {
        id: 6,
        nome: "Gabinete Tati",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBT489D4",
        imagemPerfil: "/img/perfil_gab_tati.png",
        perfis: []
    },
    {
        id: 7,
        nome: "Gabinete Rose",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBR501E5",
        imagemPerfil: "/img/perfil_gab_rose.png",
        perfis: [
            { id: 1, nome: "Rose" },

        ]
    },
    {
        id: 8,
        nome: "Gabinete Patrick",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBP623F6",
        imagemPerfil: "/img/perfil_gab_patrick.png",
        perfis: [
            { id: 1, nome: "Patrick" },
        ]
    },
    {
        id: 9,
        nome: "Gabinete Adriano",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBA745G7",
        imagemPerfil: "/img/perfil_gab_adriano.png",
        perfis: [
            { id: 1, nome: "Adriano" },
        ]
    },
    {
        id: 10,
        nome: "Gabinete Chines",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBC867H8",
        imagemPerfil: "/img/perfil_gab_chines.png",
        perfis: [
            { id: 1, nome: "Chines" },
        ]
    },
    {
        id: 11,
        nome: "Gabinete Esporinha",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBE989I9",
        imagemPerfil: "/img/esporinha.png",
        perfis: [
            { id: 1, nome: "Esporinha" },
        ]
    },
    {
        id: 12,
        nome: "Gabinete Giovane",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBG111J1",
        imagemPerfil: "/img/perfil_gab_giovane.png",
        perfis: [
            { id: 1, nome: "Giovane" },
        ]
    },
    {
        id: 13,
        nome: "Gabinete Paula",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBP222K2",
        imagemPerfil: "/img/perfil_gab_paula.png",
        perfis: [
            { id: 1, nome: "Paula" },
        ]
    },
    {
        id: 14,
        nome: "Gabinete Wilson",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "GBW333L3",
        imagemPerfil: "/img/perfil_gab_wilson.png",
        perfis: [
            { id: 1, nome: "Wilson" },
        ]
    },
    {
        id: 15,
        nome: "Comissões",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "COM444M4",
        imagemPerfil: "/img/perfil_comissoes.png",
        perfis: []
    },
    {
        id: 16,
        nome: "Diretoria",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "DIR555N5",
        imagemPerfil: "/img/perfil_diretoria.png",
        perfis: [
            { id: 1, nome: "Talles" },
        ]
    },
    {
        id: 17,
        nome: "Secretaria Geral",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "SEC666O6",
        imagemPerfil: "/img/perfil_secretaria.png",
        perfis: [
            { id: 1, nome: "Adriana" },

        ]
    },
    {
        id: 18,
        nome: "Recepção",
        criadoEm: "2024-10-28",
        criadoPor: "Sistema",
        codigoEntrada: "REC777P7",
        imagemPerfil: "/img/perfil_recepcao.png",
        perfis: []
    }
];

export default setores;
