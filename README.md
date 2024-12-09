# teste Luizalabs
## Documentação da aplicação

## Persistência
Foi utilizada uma abordagem baseada em inversão de dependência para a camada de persistência. Tanto que existem dois "brokers". Um mongodb e outro em memória. A aplicação está configurada para usar o broker MongoDB, porém existe a possibilidade de substituir a camada de persistência sem alterar em nada o resto da aplicação.

## Modelagem
A Abordagem para a inserção de dados foi o mapeamento direto da entrada para registros no DB. Antes da inserção existe toda a conversão dos dados para um array de objetos válidos para a inserção. Todas as entradas são consolidadadas sob o id do usuário fornecido, e sobrescritas utilizando o mesmo ID e nomes diferentes provocam erros (tratados e retornados)

## Testes
Foram criados testes usando o engine de testes próprio do node.js, Os testes contemplam a conversão dos dados down-top e a persistência usando
o broker em memória como mock para o mongoDB. O coverage de testes não é 100%, e muitos testes estão como TODO ainda.

## Como interagir
Existe um arquivo chamado insomnia.json no root do projeto. Se trata de uma suite de requests para ser utilizada no insomnia. É necessário importar o arquivo para usar.

## Considerações

Existe uma falha lógica na inserção de produtos. Como aparentemente é necessário aceitar mais de uma entrada de produtos com o mesmo ID num pedido, é impossível saber se estão sendo inseridos dados duplicados (sem degradação de performance, que exigiria consulta para cada inserção de produto). E ainda com a verificação, não é possível garantir integridade, por n razões.
Então é possível, inserindo o mesmo arquivo mais de uma vez, inserir produtos duplicados numa order. Ou usando arquivos diferentes com extrações diferentes dos dados originais.


## Modo de usar
### rodar testes: `npm run tests:all`
### aplicação node local (para dev & debug): `npm run dev`
### aplicação node local : `npm run prod`
### container docker: `npm run docker:deploy`

Notar que para os dois modos de aplicação local é necessário um servidor mongodb default local

No caso da execução em docker, é provido um servidor mongo no próprio container. É necessário ter o docker instalado na máquina.

**Em todos os casos é necessário ter o node.js (v22) instalado.**


## Documentação da API


### Base URL
`localhost:3000`

---

## Endpoints

### 1. Informações Gerais da API
- **Endpoint:** `/`
- **Método:** `GET`
- **Descrição:** Retorna informações gerais da API.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Informações sobre o status ou configurações da API. Texto simples.

---

### 2. Inserir Registros
- **Endpoint:** `/records`
- **Método:** `PUT`
- **Descrição:** Adiciona novos registros ao sistema.
- **Headers:**  
  - `Content-Type`: `multipart/form-data`
- **Body:** 
  - `dataset:<file data>`
- **Resposta esperada:** Lista de informações sobre o upsert. (resposta 1)
  

---

### 3. Listar Todos os Registros
- **Endpoint:** `/records`
- **Método:** `GET`
- **Descrição:** Retorna todos os registros armazenados.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Lista de registros em formato JSON. (resposta 2)

---

### 4. Listar Registros por Usuário
- **Endpoint:** `/records/user/:id`
- **Método:** `GET`
- **Descrição:** Retorna todos os registros relacionados a um usuário específico.
- **Parâmetros de URL:**
  - `id` (Obrigatório): Identificador do usuário.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Lista de registros associados ao usuário. (resposta 2)

---

### 5. Listar Registros por Pedido
- **Endpoint:** `/records/order/:id`
- **Método:** `GET`
- **Descrição:** Retorna os registros de um pedido específico.
- **Parâmetros de URL:**
  - `id` (Obrigatório): Identificador do pedido.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Detalhes dos registros relacionados ao pedido. (resposta 2)

---

### 6. Listar Registros por Data
- **Endpoint:** `/records/date/:sD/:eD`
- **Método:** `GET`
- **Descrição:** Retorna registros filtrados por um intervalo de datas.
- **Parâmetros de URL:**
  - `sD` (Obrigatório): Data de início no formato `YYYY-MM-DD`.
  - `eD` (Obrigatório): Data de fim no formato `YYYY-MM-DD`.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Lista de registros entre as datas fornecidas. (resposta 2)

---

## Exemplo de Resposta 1 (PUT /records)
```json
{
    "success": true | false,
    "message": "string",
    "inserted_users": 0..n,
    "inserted_orders": 0..n,
    "inserted_products": 0..n
}
```


## Exemplo de Resposta 2 (GET /records/*)
```json
[
 {
    "user_id": 70,
    "name": "Palmer Prosacco",
    "orders": [
        {
            "order_id": 753,
            "total": 1836.74,
            "date": "2021-03-08",
            "products": [
                {
                    "product_id": 3,
                    "value": 1836.74
                }, ...
            ]
        }, ...
    ]
}, ...
]
```

## Exemplo de Formulário HTML (PUT /records)
```html
<form action="<url>/records" method="post" enctype="multipart/form-data">
  <input type="file" name="dataset" />
</form>
```

---


