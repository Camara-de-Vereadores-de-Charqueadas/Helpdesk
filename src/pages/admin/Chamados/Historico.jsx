import "../../../styles/Admin.css";
import Header from "../../../components/Header";

export default function Historico() {
    return (
        <>
            <Header isAdmin={true} userName="Informática" />

            <div className="page">
                <h1>Histórico de Chamados</h1>
                <p>Chamados finalizados ou arquivados.</p>
                <div className="em-desenvolvimento">EM DESENVOLVIMENTO</div>
            </div>
        </>
    );
}
