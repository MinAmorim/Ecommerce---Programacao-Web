import "./App.css";
import Login from "./Components/Login/Login";
import Cadastro from "./Components/Cadastro/Cadastro";
import Home from "./Components/Home/Home";
import AtualizarCadastro from "./Components/Atualizar/AtualizarCadastro";
import GerenciarCategorias from "./Components/Admin/GerenciarCategorias";
import GerenciarProdutos from "./Components/Admin/GerenciarProdutos";
import GerenciarPedidos from "./Components/Admin/GerenciarPedidos"; // Novo Import
import MeusPedidos from "./Components/Pedidos/MeusPedidos"; // Novo Import
import Carrinho from "./Components/Carrinho/Carrinho";
import { CarrinhoProvider } from "./context/CarrinhoContext";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <CarrinhoProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Rotas de Usuário Logado */}
          <Route path="/home" element={<Home />} />
          <Route path="/atualizar" element={<AtualizarCadastro />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/meus-pedidos" element={<MeusPedidos />} /> {/* Nova Rota Cliente */}

          {/* Rotas de Administrador */}
          <Route path="/admin/categorias" element={<GerenciarCategorias />} />
          <Route path="/admin/produtos" element={<GerenciarProdutos />} />
          <Route path="/admin/pedidos" element={<GerenciarPedidos />} /> {/* Nova Rota Admin */}
        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}

export default App;