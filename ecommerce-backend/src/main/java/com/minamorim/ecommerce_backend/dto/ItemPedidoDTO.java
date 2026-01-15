package com.minamorim.ecommerce_backend.dto;

public record ItemPedidoDTO(
    Integer produtoId,
    Integer quantidade,
    String tamanho
) {}