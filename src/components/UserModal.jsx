import "../styles/Layouts/Form.css";

export default function UserModal({ onClose }) {
    return (
        <div className="user-modal-dev">
            <div className="user-modal-content">
                <h2>Usuário</h2>
                <p>Informações do usuário aqui...</p>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}
