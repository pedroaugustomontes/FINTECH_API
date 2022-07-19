const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

// Array customers simulando banco de dados em memória
const customers = [];

// Middleware para verificar se existe conta
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);

    //codigo que não deixa ser possivel prosseguir se o cpf não for encontrado no db
    if (!customer) {
        return response.status(400).json(
            {erro:'Cliente não encontrado!'}
        )
    };

    // onde o middleware for chamado irá ter acesso ao customer(CPF)
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

// REQUISITO 3, DEVE SER POSSIVEL REALIZAR UM DEPOSITO
app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;
    // codigo abaixo que cria um objeto com as infos do deposito e o insere no cliente desestruturado pelo request do middleware
    const statementOperation = {
        description,
        amount,
        date: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.listen(7474)