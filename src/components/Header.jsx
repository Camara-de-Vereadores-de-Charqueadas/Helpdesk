import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../styles/Layouts/Header.css";
import { Bell, Folder, CheckCircle, UserCircle, XCircle, DotsThree } from "@phosphor-icons/react";
import logo from "../assets/Logo.png";
import { chamadosMock } from "../data/chamados";

export default function Header({ isAdmin = true, userName = "Informática", userImage = null }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        if (location.pathname.includes("Chamados")) setActive("CHAMADOS");
        else if (location.pathname.includes("Setores")) setActive("SETORES");
        else setActive("");
    }, [location]);

    useEffect(() => {
        const mock = isAdmin
            ? chamadosMock.map((c) => ({
                id: c.id,
                title: `Chamado no setor ${c.setor} - ${c.titulo}`,
                read: false,
            }))
            : [];
        setNotifications(mock);
    }, [isAdmin]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavClick = (name) => {
        setActive(name);
        if (name === "CHAMADOS") navigate("/Chamados");
        if (name === "SETORES") navigate("/Setores");
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="Logo" className="header-logo" />
                <h1>HELPDESK</h1>
            </div>

            <nav className={`header-right ${menuOpen ? "open" : ""}`}>
                {isAdmin && (
                    <>
                        <div
                            className={`nav-item ${active === "CHAMADOS" ? "active" : ""}`}
                            onClick={() => handleNavClick("CHAMADOS")}
                        >
                            <CheckCircle size={24} weight="fill" className="icon" />
                            <span>CHAMADOS</span>
                        </div>
                        <div
                            className={`nav-item ${active === "SETORES" ? "active" : ""}`}
                            onClick={() => handleNavClick("SETORES")}
                        >
                            <Folder size={24} weight="fill" className="icon" />
                            <span>SETORES</span>
                        </div>
                    </>
                )}

                <div className="perfil-wrapper" ref={profileRef}>
                    <div className="nav-item perfil" onClick={handleProfileClick}>
                        {userImage ? (
                            <img
                                src={userImage}
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
                            <UserCircle size={35} weight="fill" color="#fff" className="icon" />
                        )}
                        <small>{userName}</small>
                    </div>

                    {showProfileMenu && (
                        <div className="submenu perfil-menu">
                            <span className="submenu-item config">Configurações</span>
                            <span className="submenu-item logout">
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
