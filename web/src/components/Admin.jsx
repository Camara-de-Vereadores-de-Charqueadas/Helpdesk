import "../styles/Admin.css";
import { Book } from "@phosphor-icons/react";
import pdfManual from "../assets/manual_helpdesk.pdf";

export default function Admin({ dataAtual, menuItems }) {
  return (
    <div className="visualizacao-admin">
      <div className="cards-admin">
        <div className="card-admin fade-in">
          <h3 className="title-h3">MANUAL HELPDESK</h3>
          <button
            className="info"
            onClick={() =>
              window.open(pdfManual, "_blank", "noopener,noreferrer")
            }
          >
            ABRIR PDF
            <Book size={15} color="#f9f1f1" weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
