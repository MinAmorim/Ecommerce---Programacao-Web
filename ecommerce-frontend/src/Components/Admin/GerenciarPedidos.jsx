import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css"; 

function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [resumo, setResumo] = useState({ totalFaturado: 0, totalPedidos: 0, itensVendidos: 0 });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/pedidos/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setErro("Acesso Negado: Apenas administradores podem ver relatórios.");
        return;
      }

      if (!res.ok) {
        setErro("Erro ao carregar dados do servidor.");
        return;
      }

      const data = await res.json();
      setPedidos(data);
      calcularRelatorios(data);

    } catch (err) {
      console.error(err);
      setErro("Erro de conexão (verifique se o backend está rodando).");
    }
  };

  const calcularRelatorios = (dados) => {
    const total = dados.reduce((acc, p) => acc + p.valorTotal, 0);
    const itens = dados.reduce((acc, p) => acc + p.itens.reduce((iAcc, item) => iAcc + item.quantidade, 0), 0);
    
    setResumo({
      totalFaturado: total,
      totalPedidos: dados.length,
      itensVendidos: itens
    });
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("ATENÇÃO: Excluir um pedido altera os relatórios financeiros. Tem a certeza?")) return;

    try {
      const res = await fetch(`http://localhost:8081/api/pedidos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Pedido removido com sucesso.");
        carregarPedidos(); 
      } else {
        alert("Erro ao excluir pedido.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Relatórios Gerenciais</h2>
      <button onClick={() => navigate("/home")} className="btn-save" style={{background: "#95a5a6", marginBottom: "20px"}}>Voltar</button>

      {erro && <div style={{padding: "20px", background: "#ffcccc", color: "red", borderRadius: "5px"}}>{erro}</div>}

      
      {!erro && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
            <div className="dashboard-card" style={{ flex: 1, background: "#3498db", color: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <h3>Total Faturado</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>R$ {resumo.totalFaturado.toFixed(2)}</p>
            </div>
            
            <div className="dashboard-card" style={{ flex: 1, background: "#2ecc71", color: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <h3>Pedidos Realizados</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{resumo.totalPedidos}</p>
            </div>

            <div className="dashboard-card" style={{ flex: 1, background: "#f39c12", color: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <h3>Peças Vendidas</h3>
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{resumo.itensVendidos}</p>
            </div>
        </div>
      )}

      <h3>Detalhamento de Vendas</h3>
      <div className="admin-list" style={{ display: "block" }}>
        {pedidos.length === 0 && !erro && <p>Nenhuma venda registrada até o momento.</p>}
        
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="admin-product-item" style={{ flexDirection: "column", alignItems: "flex-start", marginBottom: "20px", padding: "20px", borderLeft: "5px solid #3498db" }}>
            
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <strong style={{ fontSize: "1.2rem" }}>Pedido #{pedido.id}</strong> 
                <span style={{ marginLeft: "10px", color: "#555", fontSize: "1rem" }}>
                   Cliente: {pedido.usuario?.nome} ({pedido.usuario?.email})
                </span>
                <br/>
                <small style={{ fontSize: "0.9rem", color: "#777" }}>Data: {new Date(pedido.dataPedido).toLocaleString()}</small>
              </div>
              
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#2c3e50" }}>R$ {pedido.valorTotal.toFixed(2)}</span>
                
                
                <button 
                  onClick={() => handleExcluir(pedido.id)} 
                  style={{ 
                    backgroundColor: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "10px 20px", 
                    fontSize: "1rem",     
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#e74c3c"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#c0392b"}
                >
                  Excluir Registro
                </button>

              </div>
            </div>

            <div style={{ width: "100%", background: "#f8f9fa", padding: "15px", borderRadius: "5px", fontSize: "0.95rem" }}>
                <strong>Produtos:</strong>
                <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                    {pedido.itens.map(item => (
                        <li key={item.id} style={{ marginBottom: "5px" }}>
                            {item.quantidade}x <strong>{item.produto?.nome}</strong> (Tam: {item.tamanho})
                        </li>
                    ))}
                </ul>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default GerenciarPedidos;