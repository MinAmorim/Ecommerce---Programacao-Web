import { useState, useEffect } from "react";
import "./Admin.css"; 

function GerenciarCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!novaCategoria) return;

    try {
      const response = await fetch("http://localhost:8081/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: novaCategoria }),
      });

      if (response.ok) {
        alert("Categoria criada!");
        setNovaCategoria("");
        fetchCategorias(); 
      } else {
        alert("Erro ao criar categoria (verifique se já existe ou se é Admin).");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza?")) return;

    try {
      const response = await fetch(`http://localhost:8081/api/categorias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchCategorias();
      } else {
        alert("Erro ao excluir. Pode haver produtos vinculados a esta categoria.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Gerenciar Categorias</h2>
      
      <form onSubmit={handleSalvar} className="admin-form">
        <input
          type="text"
          placeholder="Nome da Categoria (ex: Roupas)"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
        />
        <button type="submit" className="btn-save">Adicionar</button>
      </form>

      <ul className="admin-list">
        {categorias.map((cat) => (
          <li key={cat.id}>
            <span>{cat.nome}</span>
            <button onClick={() => handleExcluir(cat.id)} className="btn-delete">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GerenciarCategorias;