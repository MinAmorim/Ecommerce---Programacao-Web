package com.minamorim.ecommerce_backend.service;

import com.minamorim.ecommerce_backend.dto.AtualizarDadosDTO;
import com.minamorim.ecommerce_backend.model.Usuario;
import com.minamorim.ecommerce_backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ClienteService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private Usuario getUsuarioLogado(String login) {
        return usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

    @Transactional
    public Usuario atualizarMeusDados(String login, AtualizarDadosDTO dto) {
        Usuario usuario = getUsuarioLogado(login);

        // Atualiza nome e email
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());

        // Atualiza senha somente se o usuário enviou uma nova
        if (dto.senha() != null && !dto.senha().isBlank()) {
            String senhaCriptografada = passwordEncoder.encode(dto.senha());
            usuario.setSenha(senhaCriptografada);
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void deletarMinhaConta(String login) {
        Usuario usuario = getUsuarioLogado(login);
        usuarioRepository.delete(usuario);
    }

    public Usuario getMeusDados(String login) {
        return getUsuarioLogado(login);
    }
}
