import "../styles/Layouts/Aside.css";
import { useState, useEffect } from "react";
import logoCamara from "../assets/logoCharqueadas.png";
import logoCharqueadas from "../assets/logoCharq.png";
import {
  ListIcon,
  FolderOpenIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@phosphor-icons/react";

export default function Aside({ onFiltroChange, chamados = [] }) {
  const [activeItem, setActiveItem] = useState("Todos");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Todos", Icon: ListIcon },
    { name: "Abertos", Icon: FolderOpenIcon },
    { name: "Em andamento", Icon: ClockIcon },
    { name: "Fechados", Icon: CheckCircleIcon },
  ];

  const logo = windowWidth <= 768 ? logoCharqueadas : logoCamara;

  const handleClick = (itemName) => {
    setActiveItem(itemName);
    onFiltroChange(itemName);
  };

  const resumo = [
    {
      label: "Abertos",
      count: chamados.filter((c) => c.status === "NAO VISUALIZADO").length,
      cor: "resumo-abertos",
    },
    {
      label: "Em andamento",
      count: chamados.filter((c) => c.status === "EM ANDAMENTO").length,
      cor: "resumo-em-andamento",
    },
    {
      label: "Fechados",
      count: chamados.filter((c) => c.fechado == 1).length,
      cor: "resumo-fechados",
    },
  ];

  return (
    <aside className="aside-dev">
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={activeItem === item.name ? "active" : "inactive"}
            onClick={() => handleClick(item.name)}
          >
            <span className="icone">
              <item.Icon size={32} color="#96bed8" weight="bold" />
            </span>
            <span className="text">{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="resumo-rapido">
        <h4 className="resumo-titulo">Resumo rápido</h4>
        {resumo.map(({ label, count, cor }) => (
          <div key={label} className={`resumo-item ${cor}`}>
            <span className="resumo-label">{label}</span>
            <span className="resumo-count">{count}</span>
          </div>
        ))}
      </div>

      <div className="logo-bottom">
        <img src={logo} alt="Logo" />
      </div>
    </aside>
  );
}
