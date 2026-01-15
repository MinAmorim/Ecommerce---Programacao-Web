import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../../context/CarrinhoContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { adicionarAoCarrinho, carrinho } = useCarrinho();
  
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // estado para armazenar tamanho e quantidade selecionados de cada produto
  const [selecoes, setSelecoes] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    fetch("http://localhost:8081/api/cliente/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.role === "ROLE_ADMIN") setIsAdmin(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:8081/api/produtos")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSelectionChange = (id, field, value) => {
    setSelecoes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleComprar = (produto) => {
    const selecaoAtual = selecoes[produto.id] || {};
    const quantidade = parseInt(selecaoAtual.quantidade) || 1;
    const tamanho = selecaoAtual.tamanho;

    if (!tamanho) {
      alert("Por favor, selecione um tamanho antes de comprar!");
      return;
    }

    const tamanhoEstoque = produto.tamanhos.find(t => t.tamanho === tamanho);
    if (tamanhoEstoque && quantidade > tamanhoEstoque.quantidade) {
      alert(`Só temos ${tamanhoEstoque.quantidade} unidades do tamanho ${tamanho}.`);
      return;
    }

    adicionarAoCarrinho(produto, quantidade, tamanho);
    alert(`Adicionado: ${quantidade}x ${produto.nome} (Tam: ${tamanho})`);
  };

  return (
    <div className="home-container">
      <header className="user-header">
        <div className="welcome-section">
          <h1>Bem-vindo de volta!</h1>
          <p>{isAdmin ? "Modo Administrador " : "Confira as novidades!"}</p>
        </div>
        
        <div className="user-actions">
          {/* AÇÕES DE CLIENTE*/}
          {!isAdmin && (
            <>
              <button className="action-btn cart" onClick={() => navigate("/carrinho")} style={{background: "#f1c40f", color: "black"}}>
                🛒 Carrinho ({carrinho.reduce((acc, item) => acc + item.quantidade, 0)})
              </button>
              <button className="action-btn" onClick={() => navigate("/meus-pedidos")}>Meus Pedidos</button>
            </>
          )}

          {/* AÇÕES DE ADMINISTRADOR */}
          {isAdmin && (
            <>
              <button className="action-btn admin" onClick={() => navigate("/admin/categorias")}>Categorias</button>
              <button className="action-btn admin" onClick={() => navigate("/admin/produtos")}>Produtos</button>
              <button className="action-btn admin" onClick={() => navigate("/admin/pedidos")} style={{background: "#e67e22"}}>Pedidos</button>
            </>
          )}

          <button className="action-btn update" onClick={() => navigate("/atualizar")}>Meus Dados</button>
          <button className="action-btn logout" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main className="products-section">
        <h2>Produtos Disponíveis</h2>
        
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="products-grid">
            {produtos.map((produto) => {
              const selecao = selecoes[produto.id] || { quantidade: 1, tamanho: "" };
              
              const estoqueTotal = produto.tamanhos 
                ? produto.tamanhos.reduce((acc, t) => acc + t.quantidade, 0) 
                : 0;

              return (
                <div key={produto.id} className="product-card">
                  {produto.imagemUrl && (
                    <img src={produto.imagemUrl} alt={produto.nome} className="product-image" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  )}
                  
                  <div className="card-header">
                    <h3>{produto.nome}</h3>
                    <span className="product-price">R$ {produto.preco.toFixed(2)}</span>
                  </div>
                  
                  <p className="product-desc">{produto.descricao}</p>
                  
                  {!isAdmin && (
                    <div className="product-controls" style={{ margin: "10px 0", padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>
                      
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.9rem", marginRight: "5px" }}>Tamanho:</label>
                        <select 
                          value={selecao.tamanho} 
                          onChange={(e) => handleSelectionChange(produto.id, "tamanho", e.target.value)}
                          style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                        >
                          <option value="">Selecione...</option>
                          {produto.tamanhos && produto.tamanhos.map(t => (
                            <option key={t.id} value={t.tamanho} disabled={t.quantidade === 0}>
                              {t.tamanho} {t.quantidade === 0 ? "(Esgotado)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.9rem", marginRight: "5px" }}>Qtd:</label>
                        <input 
                          type="number" 
                          min="1" 
                          max={produto.tamanhos?.find(t => t.tamanho === selecao.tamanho)?.quantidade || 99}
                          value={selecao.quantidade}
                          onChange={(e) => handleSelectionChange(produto.id, "quantidade", e.target.value)}
                          style={{ width: "60px", padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="card-footer">
                    {isAdmin && (
                        <span className="stock-badge">Estoque Total: {estoqueTotal}</span>
                    )}
                    
                    {!isAdmin && estoqueTotal > 0 && (
                      <button className="buy-btn" onClick={() => handleComprar(produto)}>
                        Adicionar
                      </button>
                    )}
                    
                    {estoqueTotal === 0 && <span style={{color: "red", fontWeight: "bold"}}>ESGOTADO</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;