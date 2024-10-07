const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); 

const quotes = [
    {id: 1, text:"soy texto1", },
    {id: 2, text:"soy texto2", },
    {id: 3, text:"soy texto3", },
    {id: 4, text:"soy texto4", },
    {id: 5, text:"soy texto5", },
    {id: 6, text:"soy texto6", },
    {id: 7, text:"soy texto7", },
    {id: 8, text:"soy texto8", },
    {id: 9, text:"soy texto9", },
    {id: 10, text:"soy texto10", },
]; 

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

async function generateUniqueQuote() {
    const prompt = "Generate a unique quote"; 

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', 
            messages: [{ role: 'user', content: prompt }],
        });

        const quote = response.choices[0].message.content.trim();
        quotes.push(quote); 
        return quote;
        
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
    }
}

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length); // Selecciona un índice aleatorio
    return quotes[randomIndex]; // Retorna la cita aleatoria
}

// Ruta principal para devolver una cita aleatoria
app.get('/api/quote', (req, res) => {
    const randomQuote = getRandomQuote(); // Genera una cita aleatoria
    res.status(200).json(randomQuote); // Enviar la cita generada
});


app.get('/api/quote', async (req, res) => {
    // const newQuote = await generateUniqueQuote();
    res.status(200).json(quotes); 
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});