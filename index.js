const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

app.post('/avaliar', async (req, res) => {
  const { sintomas } = req.body;

  const prompt = `Você é um assistente médico especializado em pediatria. Um paciente descreveu os seguintes sintomas: "${sintomas}". Baseado nesses sintomas, forneça:
  - 1 a 2 possíveis diagnósticos
  - Uma conduta médica recomendada (em linguagem simples)
  - Seja objetivo, claro e sempre oriente a procurar atendimento médico quando necessário.`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um médico pediatra que ajuda com diagnóstico baseado em sintomas.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300
    });

    const resposta = completion.data.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar os sintomas.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
