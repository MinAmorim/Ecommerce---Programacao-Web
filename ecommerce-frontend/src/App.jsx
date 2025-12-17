import "./App.css";
import Login from "./Components/Login/Login";
import Cadastro from "./Components/Cadastro/Cadastro";
import Home from "./Components/Home/Home";
import AtualizarCadastro from "./Components/Atualizar/AtualizarCadastro";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/atualizar" element={<AtualizarCadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
