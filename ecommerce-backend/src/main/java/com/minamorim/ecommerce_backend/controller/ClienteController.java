package com.minamorim.ecommerce_backend.controller;

import com.minamorim.ecommerce_backend.dto.AtualizarDadosDTO;
import com.minamorim.ecommerce_backend.model.Usuario;
import com.minamorim.ecommerce_backend.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cliente") 
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

   
    @GetMapping("/me")
    public ResponseEntity<Usuario> getMeusDados(Authentication authentication) {
        
        String login = authentication.getName();
        Usuario usuario = clienteService.getMeusDados(login);
        return ResponseEntity.ok(usuario);
    }

    
    @PutMapping("/me")
    public ResponseEntity<Usuario> atualizarMeusDados(Authentication authentication, @RequestBody AtualizarDadosDTO dto) {
        String login = authentication.getName();
        Usuario usuarioAtualizado = clienteService.atualizarMeusDados(login, dto);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    
    @DeleteMapping("/me")
    public ResponseEntity<?> deletarMinhaConta(Authentication authentication) {
        String login = authentication.getName();
        clienteService.deletarMinhaConta(login);
        return ResponseEntity.ok("Conta deletada com sucesso.");
    }
}