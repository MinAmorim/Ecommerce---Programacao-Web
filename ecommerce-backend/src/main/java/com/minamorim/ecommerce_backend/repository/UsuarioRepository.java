package com.minamorim.ecommerce_backend.repository;

import com.minamorim.ecommerce_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByLogin(String login);
    Optional<Usuario> findByEmail(String email);
}
