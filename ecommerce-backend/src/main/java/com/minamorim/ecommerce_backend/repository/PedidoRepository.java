package com.minamorim.ecommerce_backend.repository;

import com.minamorim.ecommerce_backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioLogin(String login); 
}