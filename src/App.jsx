import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Index";
import Login from "./pages/Login";
import Setores from "./pages/admin/Setores";
import Chamados from "./pages/admin/Chamados/Index";
import Historico from "./pages/admin/Chamados/Historico";

// Modais
import ModalPerfil from "./components/modais/ModalPerfil";
import ModalChamadoUser from "./components/modais/ModalChamadoUser";
import ModalChamadoAdmin from "./components/modais/ModalChamadoAdmin";

// Componentes
import Aside from "./components/Aside";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Notification from "./components/Notification";

import "./App.css";

export default function App() {
  const [userType, setUserType] = useState(null); // "admin" ou "user"

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login userType={userType} />} />

          {/* Demais rotas */}
          <Route path="/Home" element={<Home userType={userType} />} />
          <Route path="/Login" element={<Login userType={userType} />} />
          <Route path="/Setores" element={<Setores />} />
          <Route path="/Chamados" element={<Chamados />} />
          <Route path="/Historico" element={<Historico />} />

          {/* Modais */}
          <Route path="/modais/ModalPerfil" element={<ModalPerfil />} />
          <Route path="/modais/ModalChamadoUser" element={<ModalChamadoUser />} />
          <Route path="/modais/ModalChamadoAdmin" element={<ModalChamadoAdmin />} />

          {/* Componentes */}
          <Route path="/componentes/Aside" element={<Aside />} />
          <Route path="/componentes/Footer" element={<Footer />} />
          <Route path="/componentes/Header" element={<Header />} />
          <Route path="/componentes/Notification" element={<Notification />} />
        </Routes>
      </div>
    </Router>
  );
}
