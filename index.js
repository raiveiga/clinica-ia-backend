require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/avaliar', async (req, res) => {
  const { sintomas } = req.body;

  try {
    const resposta = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um assistente médico pediátrico que ajuda a identificar possíveis diagnósticos com base em sintomas.' },
        { role: 'user', content: sintomas }
      ],
      temperature: 0.7
    });

    const resultado = resposta.choices[0].message.content;
    res.json({ resposta: resultado });

  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    res.status(500).json({ erro: 'Erro ao processar os sintomas.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
