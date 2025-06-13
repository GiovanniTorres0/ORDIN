// ORDIN/backend/server.js (versão atualizada)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // <-- 1. IMPORTAMOS NOSSO MÓDULO DE DB

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Olá do backend da ORDIN!' });
});

// 2. SUBSTITUÍMOS A ROTA ANTIGA POR ESTA
app.get('/api/templates', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM templates'); // Faz a consulta real
    console.log('Dados buscados no Supabase:', rows);
    res.json(rows); // Envia os dados reais do banco para o frontend
  } catch (err) {
    console.error('Erro ao buscar templates no DB:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/templates', async (req, res) => {
  // 1. Pega os dados que o frontend enviou no "corpo" da requisição
  const { name, layout_json } = req.body;

  // 2. Validação simples para garantir que recebemos os dados
  if (!name || !layout_json) {
    return res.status(400).json({ error: 'Nome e layout são obrigatórios.' });
  }

  try {
    // 3. Monta a query SQL para INSERIR os dados
    //    Usamos $1, $2 para segurança (prevenção de SQL Injection)
    // Adicionamos user_id na lista de colunas e um novo parâmetro $3
    const sqlQuery = 'INSERT INTO templates (user_id, name, layout_json) VALUES ($1, $2, $3) RETURNING *';

    // Adicionamos o ID do usuário "fake" na lista de valores
    const values = [1, name, JSON.stringify(layout_json)]; // Fingindo ser o usuário de ID 1

    // 4. Executa a query no banco de dados
    const newTemplate = await db.query(sqlQuery, values);

    // 5. Se tudo deu certo, responde ao frontend com o novo template criado
    //    'RETURNING *' nos devolve o objeto que foi inserido no banco
    res.status(201).json(newTemplate.rows[0]);

  } catch (err) {
    // 6. Se deu erro no banco, informa no console e manda um erro 500
    console.error('Erro ao inserir template no DB:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao salvar.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});