package com.minamorim.ecommerce_backend.repository;

import com.minamorim.ecommerce_backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}