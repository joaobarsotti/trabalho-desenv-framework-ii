
# Faculdade Tech - Sistema de Gestão de Recursos e Usuários

Este projeto implementa uma aplicação Full Stack para gerenciamento de equipamentos e manutenções de uma faculdade, utilizando Node.js/Express no back-end e arquivos estáticos no front-end. O sistema inclui autenticação segura com JWT e está preparado para deploy contínuo usando GitHub Actions.

## Tecnologias Utilizadas

Back-end: Node.js, Express

Banco de Dados: Sequelize ORM com PostgreSQL (produção) / SQLite (local) 

Segurança: JSON Web Token (JWT) para autenticação e Bcrypt para hashing de senhas 

Deploy/Infraestrutura: Docker, GitHub Actions (CI/CD), Azure (ou Render) 

Front-end: HTML, CSS (Padronizado), JavaScript

## Estrutura do Projeto

A aplicação segue uma arquitetura modularizada (MVC simplificado):

server.js: Ponto de entrada principal, configura Express, Swagger e rotas.

/models: Define as estruturas do banco de dados (User, Equipment, Maintenance).

/controllers: Contém a lógica de negócio (CRUD).

/routes: Mapeia os endpoints HTTP para os controladores.

/middleware: Armazena middlewares como a autenticação JWT.

/css, /js: Arquivos estáticos do Front-end.

swagger.yaml: Documentação da API.

Dockerfile: Para conteinerização da API.

## Instruções de Deploy

1. Pré-requisitos Locais Certifique-se de ter o Node.js, npm, Docker e o Git instalados.

2. Instalação e Execução Local Para rodar a aplicação localmente (usando SQLite):

Clone o repositório:
```
git clone [URL_DO_SEU_REPOSITORIO] cd [NOME_DO_PROJETO] Instale as Dependências:
```

Instale as Dependências:
```
npm install

```

Inicialize o Servidor (API):
```
node server.js
```

O terminal deverá exibir mensagens indicando que o servidor está rodando e conectado ao banco de dados, geralmente na porta 3000. O banco de dados SQLite (database.sqlite) será criado automaticamente na raiz do projeto, se não existir.

Acesse o Front-end: Abra seus arquivos HTML (ex: inicio.html ou login.html) diretamente no navegador.

3. Configuração de Produção (Deploy no Render/Azure) Para o deploy em produção, é necessário migrar o banco de dados e configurar o CI/CD.
  A. Backend (API Node.js com Docker) Migrar para PostgreSQL: Atualize /models/index.js para usar PostgreSQL e configure seu serviço de BD no Render (ou Azure Database).
    Configurar o Dockerfile: O seu Dockerfile já está configurado para usar o ambiente do contêiner.
    Configurar Secrets: No repositório do GitHub, configure os secrets necessários (ex: RENDER_DEPLOY_HOOK_URL ou as chaves do Azure).

  B. Frontend (Arquivos Estáticos) Hospedagem: Publique seus arquivos estáticos (.html, /css, /js) em um serviço como GitHub Pages ou Azure Static Web Apps.
    Atualizar API URL: Modifique a variável API_URL em seus scripts JS (equipamentos.js, manutencoes.js, etc.) para apontar para o domínio final da sua API hospedada no Render/Azure.

4. Continuous Deployment (Via GitHub Actions) O deploy é automatizado através de arquivos YAML localizados em .github/workflows/.
  API: Use o workflow deploy-render.yml (ou o correspondente ao Azure) para construir o Docker e implantar no serviço Web.

  Frontend: Use o workflow específico para sites estáticos (como o do GitHub Pages ou Azure Static Web Apps) para publicar os arquivos HTML/CSS/JS.
