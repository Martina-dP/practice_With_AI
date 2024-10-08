const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); 

const quotes = []; 

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
        quotes.push(quote)
        console.log("generated quote:", quote)
        return quote
        
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
    }
}

function getRandomQuote() {
    if (quotes.length === 0) {
        return  null
    }
    const randomIndex = Math.floor(Math.random() * quotes.length); 
    return quotes[randomIndex]; 
}


app.get('/api/quote', async (req, res) => {

    try {
        if (quotes.length < 100) {
            
        await generateUniqueQuote()
        }
        const randomQuote = getRandomQuote(); 
        console.log(randomQuote, "Random quote")
        res.status(200).json(randomQuote)

    } catch (error) {
        res.status(500).json({error : "It is not possible to generate quote"})
    }

});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});