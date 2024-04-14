const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir o uso do body-parser
app.use(express.json());

// Array para armazenar as pessoas
let pessoas = [];

// Rota para recuperar todas as pessoas
app.get('/pessoas', (req, res) => {
    res.json(pessoas);
});

// Rota para recuperar uma pessoa específica por meio de seu identificador
app.get('/pessoas/:id', (req, res) => {
    const id = req.params.id;
    const pessoa = pessoas.find(p => p.id === parseInt(id));
    if (!pessoa) {
        res.status(404).json({ error: 'Pessoa não encontrada.' });
    } else {
        res.json(pessoa);
    }
});

// Rota para adicionar uma nova pessoa
app.post('/pessoas', (req, res) => {
    const novaPessoa = req.body;
    if (!novaPessoa.nome || !novaPessoa.idade || !novaPessoa.email || !novaPessoa.telefone) {
        res.status(400).json({ error: 'Todos os atributos devem ser preenchidos.' });
    } else {
        // Simulação de criação de ID único (substitua por uma lógica adequada)
        novaPessoa.id = pessoas.length + 1;
        pessoas.push(novaPessoa);
        res.status(201).json(novaPessoa);
    }
});

// Rota para atualizar uma pessoa existente por meio de seu identificador
app.put('/pessoas/:id', (req, res) => {
    const id = req.params.id;
    const pessoaIndex = pessoas.findIndex(p => p.id === parseInt(id));
    if (pessoaIndex === -1) {
        res.status(404).json({ error: 'Pessoa não encontrada.' });
    } else {
        const updatedPessoa = { ...pessoas[pessoaIndex], ...req.body };
        if (!updatedPessoa.nome || !updatedPessoa.idade || !updatedPessoa.email || !updatedPessoa.telefone) {
            res.status(400).json({ error: 'Todos os atributos devem ser preenchidos.' });
        } else {
            pessoas[pessoaIndex] = updatedPessoa;
            res.json(updatedPessoa);
        }
    }
});

// Rota para remover uma pessoa da lista com base em seu identificador
app.delete('/pessoas/:id', (req, res) => {
    const id = req.params.id;
    const pessoaIndex = pessoas.findIndex(p => p.id === parseInt(id));
    if (pessoaIndex === -1) {
        res.status(404).json({ error: 'Pessoa não encontrada.' });
    } else {
        pessoas.splice(pessoaIndex, 1);
        res.json({ message: 'Pessoa removida com sucesso.' });
    }
});

// Rota para adicionar várias pessoas de uma vez
app.post('/pessoas/adicionar-varias', (req, res) => {
    const novasPessoas = req.body;

    // Verifica se o corpo da solicitação é uma matriz
    if (!Array.isArray(novasPessoas)) {
        return res.status(400).json({ error: 'O corpo da requisição deve conter uma matriz de pessoas.' });
    }

    // Verifica se cada pessoa tem todos os atributos necessários
    for (const pessoa of novasPessoas) {
        if (!pessoa.nome || !pessoa.idade || !pessoa.email || !pessoa.telefone) {
            return res.status(400).json({ error: 'Todos os atributos devem ser preenchidos para cada pessoa.' });
        }
    }

    // Adiciona as novas pessoas ao array de pessoas
    novasPessoas.forEach((pessoa, index) => {
        pessoa.id = pessoas.length + index + 1; // Simulação de ID único
    });
    pessoas.push(...novasPessoas);

    // Retorna uma resposta de sucesso
    res.status(201).json(novasPessoas);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
