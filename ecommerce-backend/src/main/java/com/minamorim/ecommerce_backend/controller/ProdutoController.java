package com.minamorim.ecommerce_backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minamorim.ecommerce_backend.model.Categoria;
import com.minamorim.ecommerce_backend.model.Produto;
import com.minamorim.ecommerce_backend.repository.ProdutoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProdutoController(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @GetMapping
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Integer id) {
        return produtoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criarProduto(
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("preco") Double preco,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("tamanhos") String tamanhosJson,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) {
        return salvarOuAtualizarProduto(new Produto(), nome, descricao, preco, categoriaId, tamanhosJson, imagem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProduto(
            @PathVariable Integer id,
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("preco") Double preco,
            @RequestParam("categoriaId") Integer categoriaId,
            @RequestParam("tamanhos") String tamanhosJson,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem
    ) {
        return produtoRepository.findById(id)
                .map(produtoExistente -> salvarOuAtualizarProduto(produtoExistente, nome, descricao, preco, categoriaId, tamanhosJson, imagem))
                .orElse(ResponseEntity.notFound().build());
    }

    private ResponseEntity<?> salvarOuAtualizarProduto(Produto produto, String nome, String descricao, Double preco, Integer catId, String tamanhosJson, MultipartFile imagem) {
        try {
            produto.setNome(nome);
            produto.setDescricao(descricao);
            produto.setPreco(preco);

            Categoria cat = new Categoria();
            cat.setId(catId);
            produto.setCategoria(cat);

            // Atualizar Tamanhos
            produto.getTamanhos().clear();
            
            List<Map<String, Object>> listaTamanhos = objectMapper.readValue(tamanhosJson, new TypeReference<>() {});
            for (Map<String, Object> t : listaTamanhos) {
                String tam = (String) t.get("tamanho");
                Integer qtd = Integer.valueOf(t.get("quantidade").toString());
                produto.adicionarTamanho(tam, qtd);
            }

            if (imagem != null && !imagem.isEmpty()) {
                String pastaUploads = "./uploads";
                Path diretorioPath = Paths.get(pastaUploads);
                if (!Files.exists(diretorioPath)) Files.createDirectories(diretorioPath);

                String nomeArquivo = UUID.randomUUID().toString() + "_" + imagem.getOriginalFilename();
                Path arquivoPath = diretorioPath.resolve(nomeArquivo);
                Files.copy(imagem.getInputStream(), arquivoPath);

                produto.setImagemUrl("http://localhost:8081/imagens/" + nomeArquivo);
            }

            return ResponseEntity.ok(produtoRepository.save(produto));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao processar dados: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarProduto(@PathVariable Integer id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            produtoRepository.deleteById(id);
            return ResponseEntity.ok("Produto excluído com sucesso.");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Não é possível excluir: Este produto já possui vendas ou está vinculado a outros registros.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao excluir produto: " + e.getMessage());
        }
    }
}