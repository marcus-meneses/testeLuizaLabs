# teste Luizalabs
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
- **Resposta esperada:** Informações sobre o status ou configurações da API.

---

### 2. Inserir Registros
- **Endpoint:** `/records`
- **Método:** `PUT`
- **Descrição:** Adiciona novos registros ao sistema.
- **Headers:**  
  - `Content-Type`: `multipart/form-data`
- **Body:** 

- **Resposta esperada:**
  

---

### 3. Listar Todos os Registros
- **Endpoint:** `/records`
- **Método:** `GET`
- **Descrição:** Retorna todos os registros armazenados.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Lista de registros em formato JSON.

---

### 4. Listar Registros por Usuário
- **Endpoint:** `/records/user/:id`
- **Método:** `GET`
- **Descrição:** Retorna todos os registros relacionados a um usuário específico.
- **Parâmetros de URL:**
  - `id` (Obrigatório): Identificador do usuário.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Lista de registros associados ao usuário.

---

### 5. Listar Registros por Pedido
- **Endpoint:** `/records/order/:id`
- **Método:** `GET`
- **Descrição:** Retorna os registros de um pedido específico.
- **Parâmetros de URL:**
  - `id` (Obrigatório): Identificador do pedido.
- **Headers:**  
  - `Content-Type`: `application/json`
- **Resposta esperada:** Detalhes dos registros relacionados ao pedido.

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
- **Resposta esperada:** Lista de registros entre as datas fornecidas.

---

## Exemplo de Resposta (GET /records/*)
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

## Exemplo de Resposta (PUT /records)
```json
{
    "success": true | false,
    "message": "string",
    "inserted_users": 0..n,
    "inserted_orders": 0..n,
    "inserted_products": 0..n
}
```

## Exemplo de Formulário HTML (PUT /records)
```html
<form action="<url>/records" method="post" enctype="multipart/form-data">
  <input type="file" name="dataset" />
</form>
```

---


