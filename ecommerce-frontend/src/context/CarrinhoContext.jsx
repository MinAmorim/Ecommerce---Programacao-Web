import { createContext, useState, useEffect, useContext } from "react";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (produto, quantidadeSelecionada, tamanhoSelecionado) => {
    setCarrinho((prev) => {
      const itemExistente = prev.find(
        (item) => item.id === produto.id && item.tamanho === tamanhoSelecionado
      );

      if (itemExistente) {
        return prev.map((item) =>
          item.id === produto.id && item.tamanho === tamanhoSelecionado
            ? { ...item, quantidade: item.quantidade + quantidadeSelecionada }
            : item
        );
      } else {
        return [
          ...prev,
          { 
            ...produto, 
            quantidade: quantidadeSelecionada, 
            tamanho: tamanhoSelecionado 
          },
        ];
      }
    });
  };

  const removerDoCarrinho = (id, tamanho) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        limparCarrinho,
        calcularTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export const useCarrinho = () => useContext(CarrinhoContext);