-- usuario admin unico do painel; sem cadastro publico
-- senha: SolNascente@2026 (trocar em producao)
INSERT INTO usuarios (nome, email, senha_hash, telefone, perfil) VALUES
('Administrador', 'admin@teste.com', '$2b$10$/QWTcjK9SoEn.ETY9173T.CmOScnveYKkRrK.rQOsBTzmH/Hn.YHi', '00000000000', 'ADMIN');