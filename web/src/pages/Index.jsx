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
  const navigate = useNavigate();

  // 🔒 Se não houver login, redireciona
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ✔️ Carrega dados REAIS do usuário logado
  const setorData = JSON.parse(localStorage.getItem("setorLogado")) || {};
  const isAdmin = setorData.nome === "Informática";

  const [dataAtual, setDataAtual] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const hoje = new Date();
    const opcoes = { day: "2-digit", month: "2-digit", year: "numeric" };
    setDataAtual(hoje.toLocaleDateString("pt-BR", opcoes));
  });

  return (
    <>
      <User userType={isAdmin ? "admin" : "user"} />
      <Header
        isAdmin={isAdmin}
        userName={setorData.nome}
        userImage={setorData.imagem_perfil}
      />

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
