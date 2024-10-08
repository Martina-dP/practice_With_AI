const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); 

const quotes = [ {id: 1, text:"soy texto1", },
    {id: 2, text:"soy texto2", },
    {id: 3, text:"soy texto3", },
    {id: 4, text:"soy texto4", },
    {id: 5, text:"soy texto5", },
    {id: 6, text:"soy texto6", },
    {id: 7, text:"soy texto7", },
    {id: 8, text:"soy texto8", },
    {id: 9, text:"soy texto9", },
    {id: 10, text:"Click the button to get a random phrase", }
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

        if (!quotes.includes(quote)) {2|
            quotes.push(quote)
            console.log("generated quote:", quote)
            return quote
        }

        return await generateUniqueQuote()
        
    } catch (error) {
        console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
    }
}

app.get('/api/quote', async (req, res) => {

    try {
        if (quotes.length < 100) {
            const newQuote = await generateUniqueQuote() 
            res.status(200).json(quotes)
        } else {
            res.status(400).json({msj: "no hay mas quotes"})
        }

    } catch (error) {
        res.status(500).json({error : "It is not possible to generate quote"})
    }

});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});