import Header from "../components/Header";
import User from "../components/info_user";
import VisualizacaoUsuario from "../components/User";
import VisualizacaoAdmin from "../components/Admin";
import "../styles/Index.css";
import bannerImg from "../assets/banner.png";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DotsThreeCircle, CheckCircle } from "@phosphor-icons/react";

export default function Home() {
    const location = useLocation();
    const navigate = useNavigate();

    // 🔒 Se não houver login, redireciona
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const setor = location.state?.setor || { nome: "Usuário", imagem: null };
    const userType = location.state?.userType || "user";
    const isAdmin = userType === "admin";

    const [dataAtual, setDataAtual] = useState("");
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const hoje = new Date();
        const opcoes = { day: "2-digit", month: "2-digit", year: "numeric" };
        setDataAtual(hoje.toLocaleDateString("pt-BR", opcoes));

        // Aqui você pode futuramente popular menuItems com dados reais
        setMenuItems([
            {
                name: "Chamados Abertos",
                color: "var(--azul)",
                icon: <DotsThreeCircle size={80} weight="fill" color="var(--azul)" />,
                info: "Nenhum chamado aberto",
            },
            {
                name: "Chamados Concluídos",
                color: "var(--verde)",
                icon: <CheckCircle size={80} weight="fill" color="var(--verde)" />,
                info: "Nenhum chamado concluído",
            },
        ]);
    }, []);

    return (
        <>
            <User userType={userType} />
            <Header isAdmin={isAdmin} userName={setor.nome} userImage={setor.imagem} />

            <section
                className="banner"
                style={{ backgroundImage: `url(${bannerImg})` }}
            >
                <div className="banner-overlay">
                    <h1>HELPDESK</h1>
                    <p>PLATAFORMA DE CHAMADOS DA INFORMÁTICA</p>
                </div>
            </section>

            <div className="page">
                {isAdmin ? (
                    <VisualizacaoAdmin dataAtual={dataAtual} menuItems={menuItems} />
                ) : (
                    <VisualizacaoUsuario />
                )}
            </div>
        </>
    );
}
