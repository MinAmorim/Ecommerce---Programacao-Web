package com.minamorim.ecommerce_backend.config;

import com.minamorim.ecommerce_backend.model.Usuario;
import com.minamorim.ecommerce_backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            
            if (usuarioRepository.findByLogin("admin@loja.com").isEmpty()) {
                
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail("admin@loja.com");
                admin.setLogin("admin@loja.com");
                admin.setSenha(passwordEncoder.encode("123456")); // senha padrão
                admin.setRole("ROLE_ADMIN");

                usuarioRepository.save(admin);
                System.out.println(">>> Usuário ADMIN criado: admin@loja.com / 123456");
            }
        };
    }
}