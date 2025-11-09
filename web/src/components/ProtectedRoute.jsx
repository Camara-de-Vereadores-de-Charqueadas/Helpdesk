// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const setor = localStorage.getItem("setorLogado");

    // Se não tiver login salvo, manda pro /login
    if (!token || !setor) {
        return <Navigate to="/login" replace />;
    }

    // Se estiver tudo certo, renderiza a página
    return children;
}
