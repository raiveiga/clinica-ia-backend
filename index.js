import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

// Carrega variáveis do .env
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Inicializa o cliente da OpenAI com a API Key do .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/perguntar", async (req, res) => {
  const { pergunta } = req.body;

  try {
    const resposta = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente médico especializado em pediatria. Responda sempre com base em condutas seguras e atuais.",
        },
        {
          role: "user",
          content: pergunta,
        },
      ],
    });

    const respostaTexto = resposta.choices[0].message.content;
    res.json({ resposta: respostaTexto });
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    res.status(500).json({ erro: "Erro ao processar sua pergunta." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
