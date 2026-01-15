package com.minamorim.ecommerce_backend.repository;

import com.minamorim.ecommerce_backend.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
}