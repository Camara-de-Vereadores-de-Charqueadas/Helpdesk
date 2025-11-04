import "../styles/Layouts/Cards.css";

export default function TicketAdmin({ titulo = "Chamado #001", status = "Aberto" }) {
    return (
        <div className="ticket-dev">
            <h3>{titulo}</h3>
            <span>Status: {status}</span>
        </div>
    );
}
