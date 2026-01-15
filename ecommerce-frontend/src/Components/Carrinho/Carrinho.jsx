import { useCarrinho } from "../../context/CarrinhoContext";
import { useNavigate } from "react-router-dom";
import "./Carrinho.css";

function Carrinho() {
  const { carrinho, removerDoCarrinho, calcularTotal, limparCarrinho } = useCarrinho();
  const navigate = useNavigate();

  const handleFinalizar = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para finalizar!");
      navigate("/");
      return;
    }

    const itensPedido = carrinho.map(item => ({
      produtoId: item.id,
      quantidade: item.quantidade,
      tamanho: item.tamanho
    }));

    try {
      const response = await fetch("http://localhost:8081/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(itensPedido)
      });

      if (response.ok) {
        alert("🎉 Compra realizada com sucesso!");
        limparCarrinho(); 
        navigate("/home"); 
      } else {
        const erro = await response.text();
        alert("Erro ao finalizar pedido: " + erro);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    }
  };

  if (carrinho.length === 0) {
    return (
      <div className="carrinho-vazio">
        <h2>Seu carrinho está vazio 🛒</h2>
        <button onClick={() => navigate("/home")}>Voltar às Compras</button>
      </div>
    );
  }

  return (
    <div className="carrinho-container">
      <h2>Seu Carrinho de Compras</h2>
      
      <div className="lista-produtos">
        {carrinho.map((item) => (
          <div key={`${item.id}-${item.tamanho}`} className="item-carrinho">
            {item.imagemUrl && <img src={item.imagemUrl} alt={item.nome} />}
            <div className="info">
              <h3>{item.nome}</h3>
              <div style={{ display: "flex", gap: "15px", color: "#555", marginTop: "5px" }}>
                <span><strong>Tamanho:</strong> {item.tamanho}</span>
                <span><strong>Qtd:</strong> {item.quantidade}</span>
              </div>
              <p className="preco">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
            <button className="btn-remove" onClick={() => removerDoCarrinho(item.id, item.tamanho)}>
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="resumo-pedido">
        <h3>Total Geral: R$ {calcularTotal().toFixed(2)}</h3>
        <div className="acoes">
          <button className="btn-limpar" onClick={limparCarrinho}>Limpar Carrinho</button>
          <button className="btn-finalizar" onClick={handleFinalizar}>Finalizar Pedido</button>
        </div>
        <button className="btn-voltar" onClick={() => navigate("/home")}>Continuar Comprando</button>
      </div>
    </div>
  );
}

export default Carrinho;