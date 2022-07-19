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
app.post("/conta", (request, response) => {
    const { cpf, name } = request.body;
    const id = uuidv4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    return response.status(201).send(customers);
});

app.listen(7474)