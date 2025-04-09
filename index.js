import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 10000;

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/perguntar', async (req, res) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    console.error('❌ Pergunta não enviada no corpo da requisição');
    return res.status(400).json({ erro: 'Pergunta não enviada' });
  }

  try {
    console.log('🟡 Enviando pergunta para OpenAI:', pergunta);

    const resposta = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente médico pediátrico. Dê respostas curtas e objetivas baseadas em sintomas.',
        },
        {
          role: 'user',
          content: pergunta,
        },
      ],
    });

    const textoGerado = resposta.choices?.[0]?.message?.content;

    if (!textoGerado) {
      console.error('❌ OpenAI não retornou conteúdo');
      return res.status(500).json({ erro: 'Resposta inválida da OpenAI' });
    }

    console.log('✅ Resposta da IA:', textoGerado);
    res.json({ resposta: textoGerado });

  } catch (error) {
    console.error('❌ Erro ao chamar OpenAI
