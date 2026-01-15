package com.minamorim.ecommerce_backend.controller;

import com.minamorim.ecommerce_backend.model.Categoria;
import com.minamorim.ecommerce_backend.repository.CategoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // PUBLICO: Listar todas
    @GetMapping
    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    // ADMIN: Criar
    @PostMapping
    public Categoria criarCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // ADMIN: Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> atualizarCategoria(@PathVariable Integer id, @RequestBody Categoria categoriaAtualizada) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNome(categoriaAtualizada.getNome());
                    return ResponseEntity.ok(categoriaRepository.save(categoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN: Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCategoria(@PathVariable Integer id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}