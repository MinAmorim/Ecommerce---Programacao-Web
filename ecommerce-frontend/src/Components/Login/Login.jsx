import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState(""); // email
  const [password, setPassword] = useState(""); // senha
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, preencha o email e a senha.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        login: username,   //login = email
        senha: password
      });

      console.log("Token recebido:", response.data.token);

      // guarda o token
      localStorage.setItem("token", response.data.token);

      navigate("/home");

    } catch (err) {
      console.error('Erro no login', err);
      setError('Email ou senha incorretos.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Faça o seu Login</h1>

        <div className="input-field">
          <input
            type="text"
            placeholder="E-mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <button type="submit">Login</button>

        {error && <p style={{color:"red", marginTop:"10px"}}>{error}</p>}

        <div className="signup-link">
          <p>
            Não tem uma conta? <a href="/cadastro">Registrar</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
