-- atualiza a senha do admin: a anterior ficou exposta em texto puro no README quando o repositorio virou publico
-- nova senha enviada separadamente ao avaliador, fora do repositorio
UPDATE usuarios SET senha_hash = '$2b$10$YGZ7XQ8N64hAuzMtWdeok.ufx2bqlsGvU4xyZRZVwKoSonBBTeLzi' WHERE email = 'admin@teste.com';