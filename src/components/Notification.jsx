import "../styles/Layouts/Notification.css";

export default function Notification({ message = "Notificação padrão" }) {
    return (
        <div className="notification-dev">
            <p>{message}</p>
        </div>
    );
}
