import React, { useEffect, useState } from 'react';
import style from "./App.module.css"

function App() {

  const [quote, setQuote] = useState(null);
  const [allQuotes, setAllQuotes] = useState([]);
  const [shownQuotes, setShownQuotes] = useState([]);
  const [allQuotesDisplayed, setAllQuotesDisplayed] = useState(false)
  const [openRecordQuotes, setOpenRecordQuotes] = useState(false)
  const [last16Quotes, setLast16Quotes] = useState([])

  const fetchQuote = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/quote');
      const data = await response.json();
      setAllQuotes(data); 
      sessionStorage.setItem("allQuotes", JSON.stringify(data))
    } catch (error) {
      console.error('Error fetching the quote:', error);
    }
  };

  const loadQuotes = () => {
    const quotesSaved = sessionStorage.getItem('shownQuotes')
    if (quotesSaved) {
      setShownQuotes(JSON.parse(quotesSaved))
    }
  }

  const saveShownQuotes = (text) => {
    const updateShownQuotes = [...shownQuotes, text]
    setShownQuotes(updateShownQuotes)
    setLast16Quotes(updateShownQuotes.slice(-16))
    sessionStorage.setItem("shownQuotes", JSON.stringify(updateShownQuotes))
  }

  const randomQuote = async () => {
    if (allQuotes.length === 0) {
        return  null
    }
    const filterQuotesShown = allQuotes.filter(f => !shownQuotes.includes(f.text))
    if (filterQuotesShown.length === 0 ) {
      setAllQuotesDisplayed(true)
      return
    }
    const randomQuote = Math.floor(Math.random() * filterQuotesShown.length); 
    const newQuote = filterQuotesShown[randomQuote]
    if (newQuote) {
      setQuote(newQuote)
      saveShownQuotes(newQuote.text)
      setAllQuotesDisplayed(false)
    }
  }

  const requestsQuotes = async () => {
    await fetchQuote()
    loadQuotes()
    setLast16Quotes([])
  }

  useEffect(() => {
    sessionStorage.clear()
    requestsQuotes()
  }, [])

  const openRecord = () => {
    setOpenRecordQuotes(!openRecordQuotes)
  }

  return (
    <div className={style.all}>
      <div className={style.currentQuote}>
        <h1 className={style.title}>Random Quote Generator</h1>
        {allQuotesDisplayed ? 
          <p className={style.text} >There are no more quotes</p> : ( quote ? 
              <p className={style.text}> " {quote.text} " </p> 
              : <p className={style.text} >Click the button to get a random quote</p>
          )}
        <button className={style.BTN} onClick={randomQuote}> 
          {quote ? "Get another quote" : "Get quote"} 
        </button>
      </div>
      <div className={style.recorQuotes}>
        <button className={style.BTN} onClick={openRecord}> 
          {openRecordQuotes ? "Close quote history" : "Open quote history"} 
        </button>
        {openRecordQuotes && (
          <div>
              {last16Quotes.map((text, index) => (
                <p className={style.quotes} key={index}>" {text} "</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
