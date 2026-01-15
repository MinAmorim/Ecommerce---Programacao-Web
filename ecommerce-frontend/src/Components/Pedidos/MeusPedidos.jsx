import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MeusPedidos.css";

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:8081/api/pedidos/meus-pedidos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Erro ao buscar pedidos:", err));
  }, [navigate]);

  return (
    <div className="meus-pedidos-container">
      <div className="header-pedidos">
        <h2>Minhas Compras</h2>
        <button className="btn-voltar" onClick={() => navigate("/home")}>Voltar para Loja</button>
      </div>
      
      {pedidos.length === 0 ? (
        <p className="empty-msg">Você ainda não fez nenhuma compra.</p>
      ) : (
        <div className="lista-pedidos">
            {pedidos.map((pedido) => (
            <div key={pedido.id} className="card-pedido">
                <div className="pedido-header">
                    <div>
                        <strong>Pedido #{pedido.id}</strong>
                        <span className="data-pedido">Data: {new Date(pedido.dataPedido).toLocaleDateString()}</span>
                    </div>
                    <span className="status-pedido">{pedido.status}</span>
                </div>
                
                <ul className="itens-pedido">
                {pedido.itens.map((item) => (
                    <li key={item.id}>
                        <span className="nome-produto">{item.produto ? item.produto.nome : "Produto Indisponível"}</span>
                        <span>Tam: {item.tamanho} | Qtd: {item.quantidade}</span>
                        <span>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                    </li>
                ))}
                </ul>
                
                <div className="pedido-total">
                Total: R$ {pedido.valorTotal.toFixed(2)}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default MeusPedidos;