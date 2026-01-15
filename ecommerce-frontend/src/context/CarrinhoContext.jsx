import { createContext, useState, useContext, useEffect } from "react";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() => {
    const salvo = localStorage.getItem("carrinho");
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarAoCarrinho = (produto, quantidade, tamanho) => {
    setCarrinho((prev) => {
      const itemExistente = prev.find(
        (item) => item.id === produto.id && item.tamanho === tamanho
      );

      if (itemExistente) {
        return prev.map((item) =>
          item.id === produto.id && item.tamanho === tamanho
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        return [...prev, { ...produto, quantidade, tamanho }];
      }
    });
  };

  const removerDoCarrinho = (id, tamanho) => {
    setCarrinho((prev) => prev.filter((item) => !(item.id === id && item.tamanho === tamanho)));
  };

  
  const atualizarQuantidade = (id, tamanho, novaQuantidade) => {
    if (novaQuantidade < 1) return; 
    
    setCarrinho((prev) => 
        prev.map((item) => 
            (item.id === id && item.tamanho === tamanho) 
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
    );
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const calcularTotal = () => {
    return carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade, 
        limparCarrinho,
        calcularTotal,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export const useCarrinho = () => useContext(CarrinhoContext);