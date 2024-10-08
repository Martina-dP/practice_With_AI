import './App.css';

import React, { useEffect, useState } from 'react';

function App() {

  const [quote, setQuote] = useState(null);
  const [allQuotes, setAllQuotes] = useState([]);
  const [shownQuotes, setShownQuotes] = useState([]);
  const [allQuotesDisplayed, setAllQuotesDisplayed] = useState(false)

  const fetchQuote = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/quote');
      const data = await response.json();
      setAllQuotes(data); 
      console.log(data)
    } catch (error) {
      console.error('Error fetching the quote:', error);
    }
  };

  const loadQuotes = () => {
    const quotesSaved = localStorage.getItem('shownQuotes')
    if (quotesSaved) {
      setShownQuotes(JSON.parse(quotesSaved))
    }
  }

  const saveShownQuotes = (text) => {
    const updateShownQuotes = [...shownQuotes, text]
    setShownQuotes(updateShownQuotes)
    localStorage.setItem("shownQuotes", JSON.stringify(updateShownQuotes))
  }

  const randomQuote = async () => {
    if (allQuotes.length === 0) {
        return  null
    }

    const filterQuotesShown = allQuotes.filter(f => !shownQuotes.includes(f.text))

    if (filterQuotesShown.length === 0 ) {
      setAllQuotesDisplayed(true)
    }

    const randomQuote = Math.floor(Math.random() * filterQuotesShown.length); 
    const newQuote = filterQuotesShown[randomQuote]

    if (newQuote) {
      setQuote(newQuote)
      saveShownQuotes(newQuote.text)
      setAllQuotesDisplayed(false)
  }
  }

  useEffect(() => {
    fetchQuote()
    loadQuotes()
  }, [])

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Random Quote Generator</h1>
      {allQuotesDisplayed ? 
        <p>There are no more quotes</p> : (
          quote ? <p>{quote.text}</p> : <p>Haz clic en el botón para mostrar una cita.</p>
        )}
      <button onClick={randomQuote}> {quote ? "Get another quote" : "Get quote"} </button>
    </div>
  );
}

export default App;
