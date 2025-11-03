
# Faculdade Tech - Sistema de Gestão de Recursos e Usuários

Este projeto implementa uma aplicação Full Stack para gerenciamento de equipamentos e manutenções de uma faculdade, utilizando Node.js/Express no back-end e arquivos estáticos no front-end. O sistema inclui autenticação segura com JWT e está preparado para deploy contínuo usando GitHub Actions.

## Tecnologias Utilizadas

Back-end: Node.js, Express

Banco de Dados: Sequelize ORM com PostgreSQL (produção) / SQLite (local) 

Segurança: JSON Web Token (JWT) para autenticação e Bcrypt para hashing de senhas 

Deploy/Infraestrutura: Docker, GitHub Actions (CI/CD), Azure (ou Render) 

Front-end: HTML, CSS (Padronizado), JavaScript

Infraestrutura/Local: Docker, Docker Compose para orquestração local (API + Banco de Dados).

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

## Instruções de Execução Local (Com Docker Compose)

Pré-requisitos Locais Certifique-se de ter o Node.js, npm, Git e Docker (com Docker Compose) instalados.

1- Clone o repositório:
```
git clone [URL_DO_SEU_REPOSITORIO] cd [NOME_DO_PROJETO] Instale as Dependências:
```

2- Instale as Dependências:
```
npm install
```

3- Inicializar o Ambiente (API e Banco de Dados)
```
docker-compose up -d --build
```
5- Acessar o Front-end da API
A API estará acessível em: 
```
http://localhost:8000/inicio.html
```
7- Acessar Documentação da API (Swagger)
A documentação interativa da API está disponível em:
```
http://localhost:8000/api-docs
```