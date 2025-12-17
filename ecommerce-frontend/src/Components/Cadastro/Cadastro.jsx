import { useState } from "react";
import "./Cadastro.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem("");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/register",
        {
          nome,
          email,
          senha,
        }
      );

      console.log("Cadastro realizado!", response.data);

      setMensagem("Cadastro realizado com sucesso!");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setMensagem("Erro: " + (err.response?.data || "Não foi possível cadastrar"));
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Realize o seu Cadastro</h1>

        <div className="input-field">
          <input
            type="text"
            placeholder="Nome completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit">Cadastrar</button>

        {mensagem && (
          <p style={{ marginTop: "15px", color: "#fff", textAlign: "center" }}>
            {mensagem}
          </p>
        )}

        <div className="login-link">
          <p>
            Já tem uma conta?{" "}
            <a href="/" style={{ color: "#fff", fontWeight: "bold" }}>
              Entrar
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Cadastro;
