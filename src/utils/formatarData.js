// utils/formatarData.js
export function formatarData(dataString) {
    const data = new Date(dataString);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    const ehHoje =
        data.getDate() === hoje.getDate() &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear();

    const ehOntem =
        data.getDate() === ontem.getDate() &&
        data.getMonth() === ontem.getMonth() &&
        data.getFullYear() === ontem.getFullYear();

    if (ehHoje) return "Hoje";
    if (ehOntem) return "Ontem";

    return data.toLocaleDateString("pt-BR"); // fallback padrão
}
