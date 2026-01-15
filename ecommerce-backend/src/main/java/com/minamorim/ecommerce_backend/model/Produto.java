package com.minamorim.ecommerce_backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;
    
    @Column(length = 1000)
    private String descricao;
    
    private Double preco;
    
    private String imagemUrl;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProdutoTamanho> tamanhos = new ArrayList<>();

    public Produto() {}

    public Produto(String nome, String descricao, Double preco, Categoria categoria) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
    
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public List<ProdutoTamanho> getTamanhos() { return tamanhos; }
    public void setTamanhos(List<ProdutoTamanho> tamanhos) { 
        this.tamanhos.clear();
        if (tamanhos != null) {
            this.tamanhos.addAll(tamanhos);
        }
    }
    
    public void adicionarTamanho(String tamanho, Integer qtd) {
        ProdutoTamanho pt = new ProdutoTamanho(tamanho, qtd, this);
        this.tamanhos.add(pt);
    }
}