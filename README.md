# Mini CRM de Leads - Solnascente Motos Honda

Teste tecnico (3a etapa) para a vaga de Desenvolvedor Full Stack Jr. na Solnascente Motos Honda: um mini CRM para captura e gestao de leads interessados em test-drive/revisao, com formulario publico e painel administrativo.

## Links

- Sistema em producao (frontend): https://sol-nascente-crm-leads.vercel.app
- API em producao (backend): https://sol-nascente-crm-leads.onrender.com
- Repositorio: https://github.com/JeffrySmith117/sol-nascente-crm-leads

### Acesso ao painel administrativo (ambiente de teste)

- URL: https://sol-nascente-crm-leads.vercel.app/login
- E-mail: admin@teste.com
- Senha: enviada separadamente ao avaliador (fora deste repositorio publico)

Observacao: por se tratar de um ambiente de teste/demonstracao, essas credenciais estao expostas aqui de proposito para facilitar a avaliacao. Em producao real, isso nunca seria versionado (ver secao "O que eu faria diferente em producao").

## Stack utilizada

Backend
- Java 17 + Spring Boot 3.3.2
- Spring Security com autenticacao via JWT
- Spring Data JPA / Hibernate
- Flyway (migrations versionadas do banco)
- PostgreSQL (Neon, banco gerenciado serverless)

Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

Infraestrutura
- Backend: Render (Docker)
- Frontend: Vercel
- Banco de dados: Neon (Postgres serverless)

### Variaveis de ambiente do frontend (Vercel)

- `VITE_API_URL`: URL da API, ex.: `https://sol-nascente-crm-leads.onrender.com/api`
- `VITE_WHATSAPP_TERESINA` e `VITE_WHATSAPP_TIMON` (opcionais): numero com DDI+DDD, ex.: `5586912345678`. Sem elas, os botoes "Falar com a unidade" e "Chamar" levam ao formulario em vez de abrir o WhatsApp.

Como o plano gratuito do Render "dorme" o servico, a landing acorda a API assim que abre e o formulario tenta reenviar sozinho (ate 4 tentativas) enquanto o servidor sobe.

## Funcionalidades

- Formulario publico de captura de lead (nome, WhatsApp, modelo de interesse, unidade Teresina/Timon), com validacao de campos e feedback visual de sucesso/erro.
- API REST para criar, listar e atualizar o status de leads.
- Painel administrativo protegido por login, com listagem de leads, filtro por status e troca de status (Novo -> Em contato -> Convertido / Perdido).
- Layout responsivo, utilizavel no celular.

## Como rodar localmente

### Pre-requisitos

- Java 17+
- Maven
- Node.js 20+
- Docker (opcional, so para subir o banco de dados local)

### 1. Clonar o repositorio

    git clone https://github.com/JeffrySmith117/sol-nascente-crm-leads.git
    cd sol-nascente-crm-leads

### 2. Banco de dados

Subir apenas o Postgres via Docker (mais simples, nao precisa buildar imagem):

    docker compose up -d db

Isso sobe o Postgres na porta 5433 do host.

### 3. Backend

Entrar na pasta backend, definir as variaveis de ambiente (PowerShell) e rodar:

    cd backend
    $env:DB_HOST="localhost"
    $env:DB_PORT="5433"
    $env:DB_NAME="crmleads_db"
    $env:DB_USER="postgres"
    $env:DB_PASSWORD="postgres"
    $env:JWT_SECRET="uma-chave-bem-grande-qualquer-para-desenvolvimento-local"
    $env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
    mvn spring-boot:run

O backend sobe em http://localhost:8080. O Flyway aplica as migrations automaticamente (cria as tabelas e o usuario admin de teste).

### 4. Frontend

Em outro terminal:

    cd frontend
    npm install
    npm run dev

O frontend sobe em http://localhost:5173 e ja aponta por padrao para o backend em http://localhost:8080/api.

### 5. Alternativa: tudo via Docker Compose

Tambem e possivel subir os tres servicos (banco, backend e frontend) de uma vez com:

    docker compose up --build -d

Nesse caso o backend fica em http://localhost:8081 e o frontend em http://localhost:5174.

## Decisoes tecnicas

- Reaproveitamento de base de codigo: este projeto foi adaptado a partir de outro projeto de portfolio meu (sistema de agendamento de test-drive/revisao), que ja tinha uma arquitetura validada de autenticacao JWT, migrations com Flyway e frontend em React/Vite/Tailwind. Isso permitiu concentrar o tempo do prazo de 48h no dominio do problema (leads) em vez de reconstruir infraestrutura basica do zero.
- Autenticacao simplificada: o escopo do teste pede login simples para o painel administrativo, entao optei por um unico usuario admin, semeado via migration, sem tela de cadastro publico. Isso reduz a superficie de ataque de um recurso que nao fazia parte do requisito.
- Validacao com feedback visual: o formulario publico valida os campos no cliente (tamanho minimo de nome, formato de WhatsApp, modelo preenchido) e mostra mensagens de sucesso/erro e estado de carregamento no botao de envio.
- CORS configuravel por variavel de ambiente: a lista de origens permitidas (CORS_ALLOWED_ORIGINS) e lida de uma variavel de ambiente, permitindo trocar o dominio do frontend em producao sem precisar alterar codigo ou rebuildar o backend.
- Banco gerenciado com conexao direta: o Neon foi escolhido por ter um plano gratuito generoso e sem necessidade de cartao de credito; a conexao usada e a direta (nao-pooled), necessaria para o Flyway aplicar migrations corretamente.
- Escolha do Render em vez do Railway para o backend: inicialmente configurei o deploy no Railway (mesma plataforma usada no projeto original), mas o trial gratuito da conta tinha poucos dias/creditos restantes, com risco de expirar antes da avaliacao do teste pela empresa. Optei pelo Render, que tem um plano gratuito permanente sem cartao de credito, mesmo sabendo que ele "dorme" o servico apos 15 minutos de inatividade.
- Keep-alive do backend: para mitigar o cold start do plano gratuito do Render, configurei um monitor no UptimeRobot que faz uma requisicao ao backend a cada 5 minutos, mantendo o servico sempre ativo durante o periodo de avaliacao.
- Rewrite de rotas no Vercel: foi adicionado um vercel.json com rewrite para index.html, necessario para que rotas do React Router (como /admin) nao retornem 404 ao dar refresh direto na URL.

## O que eu faria diferente em producao

- Usar um plano de hospedagem pago (sem cold start) tanto para o backend quanto para o banco, garantindo tempo de resposta consistente.
- Escrever testes automatizados (unitarios e de integracao) para os fluxos de criacao de lead, autenticacao e troca de status, que nao couberam no prazo do teste.
- Adicionar rate limiting e/ou captcha no endpoint publico de criacao de lead, ja que ele aceita requisicoes sem autenticacao e pode ser alvo de spam/abuso.
- Implementar paginacao e filtros no backend para a listagem de leads (hoje o filtro por status e feito no frontend), pensando em um volume maior de dados no futuro.
- Suportar multiplos usuarios administradores com papeis e permissoes, em vez de um unico admin fixo criado via migration.
- Gerenciar segredos (JWT_SECRET, credenciais de banco) atraves de um cofre de secrets dedicado, com rotacao periodica, em vez de variaveis de ambiente simples.
- Configurar um pipeline de CI/CD (GitHub Actions) rodando build e testes automaticamente antes de cada deploy.
- Adicionar observabilidade: logs estruturados, monitoramento de erros (ex: Sentry) e metricas de uso.
- Registrar auditoria de mudancas de status dos leads (quem alterou, quando e o status anterior).