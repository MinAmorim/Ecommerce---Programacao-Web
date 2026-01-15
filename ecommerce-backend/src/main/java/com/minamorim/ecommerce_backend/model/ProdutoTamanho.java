package com.minamorim.ecommerce_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "produto_tamanho")
public class ProdutoTamanho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tamanho; 
    private Integer quantidade; 

    @ManyToOne
    @JoinColumn(name = "produto_id")
    @JsonIgnore 
    private Produto produto;

    public ProdutoTamanho() {}

    public ProdutoTamanho(String tamanho, Integer quantidade, Produto produto) {
        this.tamanho = tamanho;
        this.quantidade = quantidade;
        this.produto = produto;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTamanho() { return tamanho; }
    public void setTamanho(String tamanho) { this.tamanho = tamanho; }
    
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }
}