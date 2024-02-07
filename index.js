import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

let usuarios = [];
let notas = [];
let contadorUsuarioId = 1;
let contadorNotasId = 1;

// Rota de criação de conta do usuário
app.post('/usuarios', async (req, res) => {
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

    // Criptografar a senha antes de armazenar
    const criptografaSenha = await bcrypt.hash(senha, 10);

    // Criar um novo usuário
    const novoUsuario = {
        id: contadorUsuarioId++,
        nome,
        email,
        senha: criptografaSenha
    };

    // Adicionar o novo usuário à lista de usuários
    usuarios.push(novoUsuario);

    // Responder com o novo usuário criado
    res.status(201).json(novoUsuario);
});


// Rota de realização de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(usuario => usuario.email === email);

    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Comparar a senha fornecida com a senha criptografada armazenada
    bcrypt.compare(senha, usuario.senha, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao comparar as senhas!' });
        }
        if (result) {
            // Senha correta
            res.status(200).json({ success: true, message: 'Login feito com sucesso!', usuario });
        } else {
            // Senha incorreta
            res.status(401).json({ message: 'Senha inválida!' });
        }
    });
});

// Rota para criar novo recado
app.post('/notas', (req, res) => {
    const { titulo, descricao } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!titulo || !descricao) {
        return res.status(400).json({ message: 'Por favor, forneça título e descrição do recado.' });
    }

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
