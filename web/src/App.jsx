// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import Chamados from "./pages/admin/Chamados/Index";
export default function App() {
  const setorLogado = localStorage.getItem("setorLogado");
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Redireciona raiz dependendo do login */}
        <Route
          path="/"
          element={
            setorLogado && token ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login aberto */}
        <Route path="/login" element={<Login />} />

        {/* Home protegida */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Exemplo: outras páginas protegidas */}
        <Route
                    path="/Chamados"
                    element={
                        <ProtectedRoute>
                            <Chamados />
                        </ProtectedRoute>
                    }
                />
      </Routes>
    </Router>
  );
}
