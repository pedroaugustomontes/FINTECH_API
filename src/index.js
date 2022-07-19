const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

// Array customers simulando banco de dados em memória
const customers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);

    //codigo que não deixa ser possivel buscar extrato em uma conta não existente
    if (!customer) {
        return response.status(400).json(
            {erro:'Cliente não encontrado!'}
        )
    };

    // onde o middleware foi chamado irá ter acesso ao customer(CPF)
    request.customer = customer;

    return next();
}

// REQUISITO 1, DEVE SER POSSIVEL CRIAR UMA CONTA
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    //codigo que não deixa ser possivel cadastrar uma conta com CPF já existente
    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

    if (customerAlreadyExists) {
        return response.status(400).json(
            {erro: 'Usuário já existe!'}
        )
    };
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send(customers);
});

// REQUISITO 2, DEVE SER POSSIVEL BUSCAR EXTRATO BANCARIO DO CLIENTE
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});

app.listen(7474)