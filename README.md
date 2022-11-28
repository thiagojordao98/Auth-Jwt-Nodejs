# auth-jwt-node
Api developed with nodejs with support for user registration and consultation in the mongoDB database.
## Run project

Clone project in your machine

```bash
 $ git clone https://github.com/thiagojordao98/auth-jwt-node.git
 $ cd auth-jwt-node
```

Now install dependencies using npm
```bash
 $ npm install
````

Running the server mongoose
```bash
 $ npm start
````
## Documentação da API

#### Register user in DB

```http
  POST /auth/register
```

| Parameter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **necessary**. username |
| `email` | `string` | **necessary**. user email |
| `password` | `string` | **necessary**. user access password |

#### User login

```http
  POST /auth/login
```

| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name` | `string` | **necessary**. username |
| `password` | `string` | **necessary**. user access password |

#### Public route access

```http
  GET localhost:3000/
```

#### Private route access

```http
  GET localhost:3000/user/:id
```
