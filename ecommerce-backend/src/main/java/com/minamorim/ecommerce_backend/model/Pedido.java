package com.minamorim.ecommerce_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataPedido = LocalDateTime.now();
    private Double valorTotal;
    private String status; 

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> itens = new ArrayList<>();

   
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public List<ItemPedido> getItens() { return itens; }
    public void setItens(List<ItemPedido> itens) { this.itens = itens; }
}