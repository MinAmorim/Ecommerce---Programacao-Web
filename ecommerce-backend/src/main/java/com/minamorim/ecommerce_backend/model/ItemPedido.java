package com.minamorim.ecommerce_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "item_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantidade;
    private String tamanho;
    private Double precoUnitario; 

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonIgnore 
    private Pedido pedido;

    public ItemPedido() {}

    public ItemPedido(Integer quantidade, String tamanho, Double precoUnitario, Produto produto, Pedido pedido) {
        this.quantidade = quantidade;
        this.tamanho = tamanho;
        this.precoUnitario = precoUnitario;
        this.produto = produto;
        this.pedido = pedido;
    }

   
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public String getTamanho() { return tamanho; }
    public void setTamanho(String tamanho) { this.tamanho = tamanho; }
    public Double getPrecoUnitario() { return precoUnitario; }
    public void setPrecoUnitario(Double precoUnitario) { this.precoUnitario = precoUnitario; }
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
}