import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AtualizarCadastro.css";

function AtualizarCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  // Carrega dados atuais do usuário
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:8081/api/cliente/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNome(res.data.nome);
        setEmail(res.data.email);
      })
      .catch(() => {
        setErro("Erro ao carregar dados do usuário.");
      });
  }, []);

  //Envia atualização
  const handleAtualizar = async (e) => {
    e.preventDefault();
    setMsg("");
    setErro("");

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:8081/api/cliente/me",
        {
          nome,
          email,
          senha: senha || undefined, // senha só é enviada se for preenchida
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMsg("Dados atualizados com sucesso!");
      setSenha(""); // limpa campo de senha
    } catch (err) {
      setErro("Erro ao atualizar: verifique os dados.");
      console.log(err);
    }
  };

  return (
    <div className="update-container">
      <form className="update-card" onSubmit={handleAtualizar}>
        <h1>Atualizar Cadastro</h1>

        <div className="input-field">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Nova senha (opcional)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {msg && <p className="success">{msg}</p>}
        {erro && <p className="error">{erro}</p>}

        <button type="submit" className="btn-primary">
          Salvar Alterações
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button>
      </form>
    </div>
  );
}

export default AtualizarCadastro;
