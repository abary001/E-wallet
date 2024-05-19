import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/cards')
      .then(response => setCards(response.data))
      .catch(error => console.error(error));
  }, []);

  const addCard = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/cards', { cardNumber, expiryDate, cvv })
      .then(response => setCards([...cards, response.data]))
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>Card Wallet</h1>
      <form onSubmit={addCard}>
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
        <button type="submit">Add Card</button>
      </form>
      <ul>
        {cards.map(card => (
          <li key={card._id}>{card.cardNumber} - {card.expiryDate}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
