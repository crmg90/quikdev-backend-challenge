<h1>API users</h1>

Api criada utilizando o framework FoalTS https://github.com/FoalTS/foal), que agrupa várias outras 
bibliotecas, como por exemplo:

- Ajv: para validação de Request
- Typeorm: biblioteca de persistência
- Tsoa: Framework utilizado para criação e organização de endpoints

Para instalar o cliente deste framework e executar o código-fonte 
localmente é necessário rodar o comando:

    npm install -g @foal/cli

Para rodar o projeto é necessário o comando 

    npm run develop

por default o projeto está configurado para rodar na porta 3001


<br/>
<h3>1. Banco de dados</h3>
O banco de dados utilizado é o mongo, hospedado no cloud atlas.

<br/>
<h3>2. Organização dos arquivos</h3>

<h4>2.1 Arquivos de configurações</h4>
Os arquivos referentes à configurações de banco de dados e demais estão 
no diretório config do projeto - <b>/my-app/config</b> .
O arquivo <b>/my-app/src/initialConfig.ts</b> contém os parâmetros para 
inicialização da aplicação (popular a tabela de profile e users).
Os usuários criados por default possuem senha "teste";

<br/>
<h4>2.2 Lógica da aplicação</h4>
A lógica de toda a aplicação está na pasta <b>/my-app/src/app</b> onde temos:

- pasta <b>controllers</b>: Onde estão os controllers 
- pasta <b>entities</b>: Entidades do banco (documents no caso de NoSQL)
- pasta <b>hooks</b>: Criação de _decorators_ que servem para (segundo próprio framework):
  - authentication & access control
  - request validation & sanitization
  - logging

    Há um hook criado na aplicação para verificar se o usuário logado tem permissão de admin (@IsAdmin) 
- pasta <b>mapper</b>: Diretório para armazenar os dto's utilizando a lib _**morphism**_
- pasta <b>services</b>: Serviços que manipulam as entidades e aplicam regras de negócio
- pasta <b>utils</b>: Classes de utilidades
- arquivo <b>app.controller.ts</b>:  arquivo principal de controle geral de roteamento dos endpoints

<br/>
<h4>2.3 Autenticação e autorização</h4>
A api utiliza oauth para realizar a authenticação e autorização, 
através da geração de <i>access token</i>(token de duração curta)
e  <i>refresh token</i> (tokens de longa duração utilizados para 
atualizar o access token).

| endpoint                                         | parâmetros           | Objetivo                                              |
| ------------------------------------------------:|:--------------------:| -----------------------------------------------------:|
| POST http://localhost:3001/api/oauth/token            | email <br/> password | Realizar o login e obter os tokens (access e refresh) |
| POST http://localhost:3001/api/oauth/refreshToken     | refreshToken         | Renovar os tokens                                     |

Quando o endpoint exigir autenticação, o header do request deve conter:
    
    Authorization: Bearer xxxx

Onde xxx é o valor do token.

<br/>
<h4>2.4 Testes</h4>
Para executar os testes da api basta executar o comando 

    npm test

- Os teste devm ser escritos dentro da pasta <b>/my-app/src/app/</b>
- Os arquivos por convenção devem terminar com *.spec.ts

<br/>
<h3>3 Regras de negócio</h3>
Conforme o arquivo de configuração inicial ( /my-app/src/initialConfig.ts ) popula a tabela de users, 
com um único administrador - clayrmg0@gmail.com.
A aplicação é dividida em dois endpoints:

- Endpoints comum a usuários
- Endpoints exclusivos de perfil administrador

<h4>3.1 Endpoints comuns</h4>

<h4>3.1.1 Carregar dados (necessário autenticação)</h4>

| Tipo      |Endpoint                              | Objetivo               |
| ---------:|-------------------------------------:| ----------------------:|
| GET       |http://localhost:3001/api/v1/user     | Retornar os dados do usuário Logado

<br/>
<h4>3.1.2 Criar novo usuário </h4>

| Tipo      |Endpoint                              | Objetivo               |
| ---------:|-------------------------------------:| ----------------------:|
| POST       |http://localhost:3001/api/v1/user    | Cadastrar novo usuário

Body:

    {
        "primaryPhone": null, 
        "username": "marquinhos",           //obrigatório
        "email": "marquinhos@gmail.com",    //obrigatório
        "name": "Marcos2",                  //obrigatório
        "birthdate": null,
        "address": "endereço 2",            //obrigatório
        "addressNumber": "n. 2011",         //obrigatório
        "description": null,
        "password": "teste"                 //obrigatório
    } 

<br/>
<h4>3.1.3 Editar usuário </h4>

| Tipo      |Endpoint                              | Objetivo               |
| ---------:|-------------------------------------:| ----------------------:|
| PUT       |http://localhost:3001/api/v1/user     | Editar os dados do usuário Logado

Body:

    {
        "primaryPhone": null, 
        "name": "Marcos2",                  //obrigatório
        "birthdate": null,
        "address": "endereço 2",            //obrigatório
        "addressNumber": "n. 2011",         //obrigatório
        "description": null,
    } 

<br/>
<h4>3.1.4 Deletar usuário </h4>

| Tipo      |Endpoint                              | Objetivo               |
| ---------:|-------------------------------------:| ----------------------:|
| DELETE    |http://localhost:3001/api/v1/user     | Quando o usuário deseja excluir sua conta

<br/>
<h4>3.1.5 Alterar localização do usuário </h4>

| Tipo      |Endpoint                              | Objetivo               |
| ---------:|-------------------------------------:| ----------------------:|
| PATCH     |http://localhost:3001/api/v1/user     | Atualizar localização do usuário

Body:

    {
        "latitude": -23.537654075009613,            //obrigatório
        "longitude": -46.678925686400014            //obrigatório
    }

<br/>

<h4>3.1.6 Friends </h4>

| Tipo      |Endpoint                                      | Objetivo               |
| ---------:|---------------------------------------------:| ----------------------:|
| GET       |http://localhost:3001/api/v1/user/friends     | Listar todos os amigos

<br/>
<h4>3.1.7 Delete friend </h4>

| Tipo      |Endpoint                                           | Objetivo               |
| ---------:|--------------------------------------------------:| ----------------------:|
| DELETE    |http://localhost:3001/api/v1/user/friends/{id}     | Excluir amizade


<br/>
<h4>3.1.8 Peoples nearby </h4>

| Tipo      |Endpoint                                                         | Objetivo               |
| ---------:|----------------------------------------------------------------:| ----------------------:|
| GET       |http://localhost:3001/api/v1/user/nearby?distance={distance}     | Listar pessoas próximas

Params:
- distance: distância em quilômetros.

<br/>
<h4>3.1.9 Friends nearby </h4>

| Tipo      |Endpoint                                                                 | Objetivo               |
| ---------:|------------------------------------------------------------------------:| ----------------------:|
| GET       |http://localhost:3001/api/v1/user/friends-nearby?distance={distance}     | Listar amigos próximos

Params:
- distance: distância em quilômetros.

<br/>
<h4>3.1.10 Invitation </h4>

| Tipo      |Endpoint                                                    | Objetivo               |
| ---------:|-----------------------------------------------------------:| ----------------------:|
| POST      |http://localhost:3001/api/v1/invitation/user/{id}           | Mandar solicitação de amizade

Params:
- id: id do usuário.

<br/>
<h4>3.1.11 Accept invite </h4>

| Tipo      |Endpoint                                                    | Objetivo               |
| ---------:|-----------------------------------------------------------:| ----------------------:|
| POST      |http://localhost:3001/api/v1/invitation/{id}/accept         | aceitar solicitação de amizade

Params:
- id: id do usuário.

<br/>
<h4>3.1.12 Reject invite </h4>

| Tipo      |Endpoint                                                    | Objetivo               |
| ---------:|-----------------------------------------------------------:| ----------------------:|
| POST      |http://localhost:3001/api/v1/invitation/{id}/reject         | rejeitar solicitação de amizade

Params:
- id: id do usuário.

<br/>
<br/>
<h4>3.2 Endpoints exclusivos</h4>

<h4>3.2.1 List all users </h4>

| Tipo      |Endpoint                                                    | Objetivo               |
| ---------:|-----------------------------------------------------------:| ----------------------:|
| GET       |http://localhost:3001/api/v1/admin/user                     | Listar todos os usuários cadastrados

<br/>
<h4>3.2.2  Editar usuário </h4>

| Tipo      |Endpoint                                         | Objetivo               |
| ---------:|------------------------------------------------:| ----------------------:|
| PUT       |http://localhost:3001/api/v1/admin/user/{id}     | Editar os dados de um usuário 

Params:
- id: id do usuário.


Body:

    {
        "primaryPhone": null, 
        "name": "Marcos2",                  //obrigatório
        "birthdate": null,
        "address": "endereço 2",            //obrigatório
        "addressNumber": "n. 2011",         //obrigatório
        "description": null,
    } 

<br/>

<h4>3.2.3  Excluir usuário </h4>

| Tipo      |Endpoint                                         | Objetivo               |
| ---------:|------------------------------------------------:| ----------------------:|
| DELETE    |http://localhost:3001/api/v1/admin/user/{id}     | Excluir um usuário

Params:
- id: id do usuário.
