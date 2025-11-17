import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Layouts/Header.css";
import {
  CheckCircle,
  UserCircle,
  XCircle,
  DotsThree,
} from "@phosphor-icons/react";
import logo from "../assets/Logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileRef = useRef(null);

  const [userData, setUserData] = useState({
    nome: "",
    imagem_perfil: "",
    isAdmin: false,
  });

  // ✅ Carrega dados do usuário logado
  useEffect(() => {
    const setorData = localStorage.getItem("setorLogado");
    if (setorData) {
      const setor = JSON.parse(setorData);
      setUserData({
        nome: setor.nome,
        imagem_perfil: setor.imagem_perfil || null,
        isAdmin: setor.nome === "Informática",
      });
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes("Chamados")) setActive("CHAMADOS");
    else setActive("");
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (name) => {
    setActive(name);
    if (name === "CHAMADOS") navigate("/Chamados");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("setorLogado");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  return (
    <header className="header">
      <div
        className="header-left"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="Logo" className="header-logo" />
        <h1>HELPDESK</h1>
      </div>

      <nav className={`header-right ${menuOpen ? "open" : ""}`}>
        {userData.isAdmin && (
          <div
            className={`nav-item ${active === "CHAMADOS" ? "active" : ""}`}
            onClick={() => handleNavClick("CHAMADOS")}
          >
            <CheckCircle size={24} weight="fill" className="icon" />
            <span>CHAMADOS</span>
          </div>
        )}

        <div className="perfil-wrapper" ref={profileRef}>
          <div className="nav-item perfil" onClick={handleProfileClick}>
            {userData.imagem_perfil ? (
              <img
                src={userData.imagem_perfil}
                alt="Perfil"
                className="perfil-img"
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                }}
              />
            ) : (
              <UserCircle
                size={35}
                weight="fill"
                color="#fff"
                className="icon"
              />
            )}
            <small>{userData.nome}</small>
          </div>

          {showProfileMenu && (
            <div className="submenu perfil-menu">
              {/* <span className="submenu-item config">Configurações</span> */}
              <span className="submenu-item logout" onClick={handleLogout}>
                <b>Sair</b>
              </span>
            </div>
          )}
        </div>
      </nav>

      <button
        className={`menu-btn ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <XCircle size={40} color="#fff" weight="fill" />
        ) : (
          <DotsThree size={40} color="#fff" weight="fill" />
        )}
      </button>
    </header>
  );
}
