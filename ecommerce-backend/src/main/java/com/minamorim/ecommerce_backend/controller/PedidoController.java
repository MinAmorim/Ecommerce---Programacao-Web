package com.minamorim.ecommerce_backend.controller;

import com.minamorim.ecommerce_backend.dto.ItemPedidoDTO;
import com.minamorim.ecommerce_backend.model.*;
import com.minamorim.ecommerce_backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoController(PedidoRepository pedidoRepository, 
                            ProdutoRepository produtoRepository, 
                            UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> criarPedido(@RequestBody List<ItemPedidoDTO> itensDTO) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuario = auth.getName();
        Usuario usuario = usuarioRepository.findByLogin(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus("CONCLUIDO");

        double total = 0.0;

        for (ItemPedidoDTO itemDTO : itensDTO) {
            Produto produto = produtoRepository.findById(itemDTO.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDTO.produtoId()));

            Optional<ProdutoTamanho> tamanhoOpt = produto.getTamanhos().stream()
                    .filter(t -> t.getTamanho().equalsIgnoreCase(itemDTO.tamanho()))
                    .findFirst();

            if (tamanhoOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Tamanho indisponível: " + itemDTO.tamanho() + " para o produto " + produto.getNome());
            }

            ProdutoTamanho produtoTamanho = tamanhoOpt.get();

            if (produtoTamanho.getQuantidade() < itemDTO.quantidade()) {
                return ResponseEntity.badRequest().body("Estoque insuficiente para " + produto.getNome() + " tamanho " + itemDTO.tamanho());
            }

            produtoTamanho.setQuantidade(produtoTamanho.getQuantidade() - itemDTO.quantidade());
            produtoRepository.save(produto);

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.quantidade());
            item.setTamanho(itemDTO.tamanho());
            item.setPrecoUnitario(produto.getPreco());

            pedido.getItens().add(item);
            total += (produto.getPreco() * itemDTO.quantidade());
        }

        pedido.setValorTotal(total);
        pedidoRepository.save(pedido);

        return ResponseEntity.ok("Pedido realizado com sucesso!");
    }
    
    @GetMapping("/meus-pedidos")
    public List<Pedido> listarMeusPedidos() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return pedidoRepository.findByUsuarioLogin(auth.getName());
    }
}