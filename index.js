import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let usuarios = [];
let notas = [];
let contadorUsuarioId = 1;
let contadorNotasId = 1;

//API

// Rota de criação de conta do usuário
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Por favor, forneça nome, email e senha.' });
    }

    // Verificar se o email já está em uso
    const usuarioExistente = usuarios.find(usuario => usuario.email === email);
    if (usuarioExistente) {
        return res.status(400).json({ message: 'Email já cadastrado!' });
    }

    // Criar um novo usuário
    const novoUsuario = {
        id: contadorUsuarioId++,
        nome,
        email,
        senha
    };

    // Adicionar o novo usuário à lista de usuários
    usuarios.push(novoUsuario);

    // Responder com o novo usuário criado
    res.status(201).json(novoUsuario);
});


// Rota de realização de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);
    if (usuario) {
        res.json({ message: 'Login feito com sucesso!', usuario });
    } else {
        res.status(401).json({ message: 'Senha inválida!' });
    }
});

// Rota para obter a lista de usuários
app.get('/usuariosLista', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Lista de usuários retornada com sucesso!',
        data: usuarios
    });
});


// Rota para atualizar informações da conta do usuário
app.put('/usuariosAtualizar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    // Encontrar o usuário pelo ID
    const usuario = usuarios.find(usuario => usuario.id === parseInt(id));

    // Verificar se o usuário existe
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Atualizar as informações do usuário
    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    usuario.senha = senha || usuario.senha;

    // Retornar o usuário atualizado
    res.json({ message: 'Informações da conta atualizadas com sucesso!', usuario });
});

// Rota para deletar um usuário pelo ID
app.delete('/usuariosDeletar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const usuarioIndex = usuarios.findIndex(usuario => usuario.id === id);
    if (usuarioIndex !== -1) {
        usuarios.splice(usuarioIndex, 1);
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado!' });
    }
});

// Rota para criar novo recado
app.post('/notas', (req, res) => {
    const { titulo, descricao } = req.body;
    const novaNota = {
        id: contadorNotasId++,
        titulo,
        descricao
    };
    notas.push(novaNota);
    res.status(201).json(novaNota);
});

// Rota para obter todos os recados
app.get('/notasTotais', (req, res) => {
    return res.status(200).json({
        success: true,
        msg: "Lista de recados retornada com sucesso!",
        data: notas
    });
});

// Rota para obter um recado específico pelo ID
app.get('/notas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nota = notas.find(nota => nota.id === id);
    if (nota) {
        res.json(nota);
    } else {
        res.status(404).json({ message: 'Nota não encontrada!' });
    }
});

// Rota para atualizar um recado existente pelo ID
app.put('/notas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, descricao } = req.body;
    const notaIndex = notas.findIndex(nota => nota.id === id);
    if (notaIndex !== -1) {
        notas[notaIndex] = { id, titulo, descricao };
        res.json(notas[notaIndex]);
    } else {
        res.status(404).json({ message: 'Nota não encontrada!' });
    }
});

// Rota para excluir um recado pelo ID
app.delete('/notas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const notaIndex = notas.findIndex(nota => nota.id === id);
    if (notaIndex !== -1) {
        notas = notas.filter(nota => nota.id !== id);
        res.json({ message: 'Nota deletada com sucesso!' });
    } else {
        res.status(404).json({ message: 'Nota não encontrada. Não é possível excluir.' });
    }
});


// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
