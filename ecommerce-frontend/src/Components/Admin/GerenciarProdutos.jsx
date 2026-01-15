import { useState, useEffect } from "react";
import "./Admin.css";

function GerenciarProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem("token");

 
  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagemArquivo, setImagemArquivo] = useState(null);
  
  const [listaTamanhos, setListaTamanhos] = useState([{ tamanho: "", quantidade: "" }]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("http://localhost:8081/api/produtos"),
        fetch("http://localhost:8081/api/categorias")
      ]);
      setProdutos(await resProd.json());
      setCategorias(await resCat.json());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleEditar = (produto) => {
    setIdEditando(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setCategoriaId(produto.categoria?.id || "");
    
    if (produto.tamanhos && produto.tamanhos.length > 0) {
      setListaTamanhos(produto.tamanhos.map(t => ({ 
        tamanho: t.tamanho, 
        quantidade: t.quantidade 
      })));
    } else {
      setListaTamanhos([{ tamanho: "", quantidade: "" }]);
    }

    setImagemArquivo(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEdicao = () => {
    setIdEditando(null);
    limparFormulario();
  };

  const limparFormulario = () => {
    setNome("");
    setDescricao("");
    setPreco("");
    setCategoriaId("");
    setImagemArquivo(null);
    setListaTamanhos([{ tamanho: "", quantidade: "" }]);
    const fileInput = document.getElementById("fileInput");
    if(fileInput) fileInput.value = "";
  };

  const handleAddTamanho = () => {
    setListaTamanhos([...listaTamanhos, { tamanho: "", quantidade: "" }]);
  };

  const handleRemoveTamanho = (index) => {
    const novaLista = [...listaTamanhos];
    novaLista.splice(index, 1);
    setListaTamanhos(novaLista);
  };

  const handleChangeTamanho = (index, campo, valor) => {
    const novaLista = [...listaTamanhos];
    novaLista[index][campo] = valor;
    setListaTamanhos(novaLista);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    const tamanhosValidos = listaTamanhos.filter(t => t.tamanho && t.quantidade);
    if (tamanhosValidos.length === 0) {
      alert("Adicione pelo menos um tamanho com quantidade!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", preco);
    formData.append("categoriaId", categoriaId);
    formData.append("tamanhos", JSON.stringify(tamanhosValidos));
    
    if (imagemArquivo) {
      formData.append("imagem", imagemArquivo);
    }

    const url = idEditando 
      ? `http://localhost:8081/api/produtos/${idEditando}`
      : "http://localhost:8081/api/produtos";
    
    const method = idEditando ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        alert(idEditando ? "Produto atualizado!" : "Produto criado!");
        limparFormulario();
        setIdEditando(null);
        carregarDados();
      } else {
        const erro = await response.text();
        alert("Erro ao salvar: " + erro);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  const handleExcluir = async (id) => {
    if(!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    
    try {
        const response = await fetch(`http://localhost:8081/api/produtos/${id}`, {
            method: "DELETE", 
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Produto excluído!");
            if (id === idEditando) handleCancelarEdicao();
            carregarDados();
        } else {
            const erroTexto = await response.text();
            alert("Erro ao excluir: " + erroTexto);
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro de conexão ao tentar excluir.");
    }
  };

  return (
    <div className="admin-container">
      <h2>{idEditando ? "Editar Produto" : "Novo Produto"}</h2>
      
      <form onSubmit={handleSalvar} className="admin-form vertical">
        
        <input 
            placeholder="Nome do Produto" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
        />
        <textarea 
            placeholder="Descrição detalhada" 
            value={descricao} 
            onChange={e => setDescricao(e.target.value)} 
            required 
        />
        <div className="form-row">
            <input 
                type="number" 
                step="0.01" 
                placeholder="Preço (R$)" 
                value={preco} 
                onChange={e => setPreco(e.target.value)} 
                required 
            />
        </div>
        <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
            <option value="">Selecione uma Categoria...</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>

        
        <div style={{ background: "#f8f9fa", padding: "10px", borderRadius: "5px", margin: "10px 0" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Estoque por Tamanho:</label>
          {listaTamanhos.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input 
                placeholder="Tam (Ex: P)" 
                value={item.tamanho}
                onChange={e => handleChangeTamanho(index, "tamanho", e.target.value)}
                style={{ width: "100px" }}
                required
              />
              <input 
                type="number" 
                placeholder="Qtd" 
                value={item.quantidade}
                onChange={e => handleChangeTamanho(index, "quantidade", e.target.value)}
                style={{ width: "100px" }}
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveTamanho(index)} className="btn-delete-sm" style={{ background: "#95a5a6" }}>X</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddTamanho} style={{ background: "#3498db", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>+ Tamanho</button>
        </div>

        
        <div style={{ margin: "10px 0" }}>
            <label style={{ display:"block", marginBottom:"5px", fontWeight: "bold", color:"#555"}}>
              {idEditando ? "Alterar Imagem (Opcional):" : "Imagem do Produto:"}
            </label>
            <input id="fileInput" type="file" accept="image/*" onChange={e => setImagemArquivo(e.target.files[0])} />
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" className="btn-save" style={{ flex: 1 }}>{idEditando ? "Atualizar" : "Salvar"}</button>
          {idEditando && (
            <button type="button" onClick={handleCancelarEdicao} className="btn-save" style={{ background: "#95a5a6", flex: 0.3 }}>Cancelar</button>
          )}
        </div>
      </form>

      
      <div className="product-list-admin">
        {produtos.map(p => {
            
            const totalEstoque = p.tamanhos 
                ? p.tamanhos.reduce((acc, t) => acc + t.quantidade, 0) 
                : 0;

            return (
                <div key={p.id} className="admin-product-item">
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {p.imagemUrl ? (
                        <img src={p.imagemUrl} alt="Foto" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                    ) : (
                        <div style={{ width: "60px", height: "60px", background: "#eee" }}></div>
                    )}
                    
                    <div>
                        <strong style={{ fontSize: "1.1rem" }}>{p.nome}</strong>
                        <div style={{ color: "#777" }}>
                            R$ {p.preco.toFixed(2)} | <span style={{fontWeight: "bold", color: "black"}}>Total: {totalEstoque} un.</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#555" }}>
                        Detalhes: {p.tamanhos ? p.tamanhos.map(t => `${t.tamanho}(${t.quantidade})`).join(", ") : "Sem estoque"}
                        </div>
                    </div>
                    </div>
                    
                    <div>
                    <button onClick={() => handleEditar(p)} className="btn-save" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", marginRight: "10px", backgroundColor: "#f39c12" }}>Editar</button>
                    <button onClick={() => handleExcluir(p.id)} className="btn-delete-sm" style={{ display: "inline-block" }}>X</button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}

export default GerenciarProdutos;