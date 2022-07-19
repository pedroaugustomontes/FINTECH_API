const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
/**
cpf - string
name - sting
uuid - universal unique id
statement
*/
const customers = [];
// REQUISITO 1, DEVE SER POSSIVEL CRIAR UMA CONTA
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    //codigo que verifica se cpf ja esta cadastrado no banco de dados
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if (customerAlreadyExists) {
        return response.status(400).json(
            {erro: 'Usuário já existe!'}
        )
    }
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send(customers);
});

app.listen(7474)