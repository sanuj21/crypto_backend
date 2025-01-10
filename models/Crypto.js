import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  symbol: {
    type: String,
    required: true,
  },

  currentPrice: {
    type: Number,
    required: true,
  },

  marketCap: {
    type: Number,
    required: true,
  },

  '24hChange': {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    required: true,
    default: 'USD',
  },

  lastUpdated: {
    type: Date,
    required: true,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

export default Crypto;
