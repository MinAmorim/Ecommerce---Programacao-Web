package com.minamorim.ecommerce_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {

        http.csrf(csrf -> csrf.disable());
        
        
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.setAllowedOrigins(List.of("http://localhost:5173"));
            config.setAllowedHeaders(List.of("*"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            return config;
        }));

        http.authorizeHttpRequests(auth -> auth
                // rotas publicas
                .requestMatchers("/api/auth/**").permitAll()
                
                // leitura publica 
                .requestMatchers(HttpMethod.GET, "/api/produtos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()

                // imagens 
                .requestMatchers("/imagens/**").permitAll()

                // rotas de admin
                .requestMatchers("/api/produtos/**").hasRole("ADMIN")
                .requestMatchers("/api/categorias/**").hasRole("ADMIN")

                
                .anyRequest().authenticated()
        );

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}