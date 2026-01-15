package com.minamorim.ecommerce_backend.repository;

import com.minamorim.ecommerce_backend.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
}