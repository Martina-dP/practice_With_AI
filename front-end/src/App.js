import './App.css';

import React, { useState } from 'react';

function App() {

  const [quote, setQuote] = useState(null);

  const fetchQuote = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/quote');
      const data = await response.json();
      setQuote(data); 
      console.log(data)
    } catch (error) {
      console.error('Error fetching the quote:', error);
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Random Quote Generator</h1>
      {quote ? <p>{quote.text}</p> : <p>Haz clic en el botón para mostrar una cita.</p>}
      {quote ? <button onClick={fetchQuote}>Get Another Quote</button> : <button onClick={fetchQuote}>Get Quote</button>}
    </div>
  );
}

export default App;
