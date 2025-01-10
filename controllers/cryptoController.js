import axios from 'axios';
import { CRYPTO_API_URL, COIN_IDS } from '../utils/Constants.js';
import Crypto from '../models/Crypto.js';
import logger from '../utils/logger.js';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/appError.js';

const fetchCryptoData = async () => {
  try {
    const result = await axios({
      method: 'get',
      url: CRYPTO_API_URL,
      params: {
        ids: COIN_IDS.join(','),
        vs_currency: 'usd',
      },
    });

    if (!result.data || result.data.length < 3) {
      console.error('Error fetching data:', res);
      return;
    }

    for (const coin of result.data) {
      const crypto = await Crypto.create({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        '24hChange': coin.price_change_24h,
        lastUpdated: new Date(coin.last_updated),
      });

      if (!crypto) {
        logger.error('Error saving record:', crypto.name);
        continue;
      }

      logger.info('One Record saved successfully:', crypto.name);
    }
  } catch (error) {
    logger.error('Error fetching data:', error.message);
  }
};

const getStats = asyncHandler(async (req, res, next) => {
  const coin = req.query.coin;

  if (!coin) {
    return next(new AppError('Coin is required', 400));
  }

  const crypto = await Crypto.findOne({ coinId: coin }).sort({
    createdAt: -1,
  });

  if (!crypto) {
    res.status(404);
    return next(new AppError('No record found for the required coin', 404));
  }

  res.status(200).json({
    status: 'success',
    price: crypto.currentPrice,
    marketCap: crypto.marketCap,
    '24hChange': crypto['24hChange'],
  });
});

const getDeviation = asyncHandler(async (req, res, next) => {
  const coin = req.query.coin;

  if (!coin) {
    res.status(400);
    return next(new AppError('Coin is required', 400));
  }

  const cryptos = await Crypto.find({ coinId: coin })
    .sort({ createdAt: -1 })
    .limit(100);

  if (!cryptos || cryptos.length === 0) {
    return next(new AppError('No record found for the required coin', 404));
  }

  const prices = cryptos.map((item) => item.currentPrice);

  // Calculating the standard deviation
  const mean = prices.reduce((a, b) => a + b) / prices.length;
  const squareDiffs = prices.map((value) => {
    const diff = value - mean;
    return diff * diff;
  });

  const avgSquareDiff =
    squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;

  res.status(200).json({
    status: 'success',
    deviation: Math.sqrt(avgSquareDiff),
  });
});

export { fetchCryptoData, getStats, getDeviation };
