import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAtualizarCadastro = () => {
    navigate("/atualizar");
  };

  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!"
    );

    if (!confirmacao) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8081/api/cliente/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Erro ao excluir conta.");
        return;
      }

      alert("Conta excluída com sucesso!");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Erro ao tentar excluir conta.");
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1 className="home-title">Bem-vinda de volta ✨</h1>
        <p className="home-subtitle">Que bom ter você aqui, fangirl 💖</p>

        <div className="home-buttons">
          <button className="home-btn update" onClick={handleAtualizarCadastro}>
            Atualizar Cadastro
          </button>

          <button className="home-btn danger" onClick={handleExcluirConta}>
            Excluir Conta
          </button>

          <button className="home-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
