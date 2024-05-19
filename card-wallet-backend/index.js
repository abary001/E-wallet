const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto-js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('MongoDB_URI', { useNewUrlParser: true, useUnifiedTopology: true });

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.error('Encryption key is not defined. Please set ENCRYPTION_KEY in the .env file.');
  process.exit(1);
}

// Card Schema
const cardSchema = new mongoose.Schema({
  cardNumber: String,
  expiryDate: String,
  cvv: String
});

const Card = mongoose.model('Card', cardSchema);

const encrypt = (text) => {
  return crypto.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = crypto.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(crypto.enc.Utf8);
};


// Routes
app.get('/cards', async (req, res) => {
  const cards = await Card.find();
  const decryptedCards = cards.map(card => ({
    _id: card._id,
    cardNumber: decrypt(card.cardNumber),
    expiryDate: decrypt(card.expiryDate),
    // Do not decrypt CVV; it's hashed
    cvv: card.cvv
  }));
  res.json(decryptedCards);
});

app.post('/cards', async (req, res) => {
  const encryptedCard = {
    cardNumber: encrypt(req.body.cardNumber),
    expiryDate: encrypt(req.body.expiryDate),
    cvv: await bcrypt.hash(req.body.cvv, 10)
  };
  const card = new Card(encryptedCard);
  await card.save();
  res.json({
    _id: card._id,
    cardNumber: req.body.cardNumber,
    expiryDate: req.body.expiryDate,
    // Do not send back the CVV; it's hashed
    cvv: "Hashed"
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
