import { Eye } from "@phosphor-icons/react";
import "../styles/Layouts/Ticket.css";

export default function Ticket({ chamado }) {
    return (
        <div className="chamado-card">
            <div className="chamado-topo">
                <strong>
                    {chamado.titulo.toUpperCase()} | {chamado.dataHora}
                </strong>
            </div>

            <div className="chamado-corpo">
                <div className="lado-esquerdo">
                    <div className="perfil-ticket">
                        <p className="titulo-info">PERFIL SOLICITANTE:</p>
                        <p className="perfil-ticket-p">{chamado.perfil}</p>
                    </div>
                    <p className="descricao">{chamado.descricaoProblema}</p>
                </div>

                <div className="lado-direito">
                    <p className="titulo-info">STATUS</p>
                    <p>{chamado.resolvido ? "Concluído" : "Em andamento"}</p>
                </div>

                <div className="icone-visualizar">
                    <Eye size={26} weight="fill" />
                </div>
            </div>
        </div>
    );
}
