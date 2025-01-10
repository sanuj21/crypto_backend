import axios from 'axios';
import { CRYPTO_API_URL, COIN_IDS } from '../utils/Constants.js';
import Crypto from '../models/Crypto.js';
import logger from '../utils/logger.js';

const fetchCryptoData = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: CRYPTO_API_URL,
      params: {
        ids: COIN_IDS.join(','),
        vs_currency: 'usd',
      },
    });

    if (!res.data || res.data.length < 3) {
      console.error('Error fetching data:', res);
      return;
    }

    for (const coin of res.data) {
      const obj = await Crypto.create({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        '24hChange': coin.price_change_24h,
        lastUpdated: new Date(coin.last_updated),
      });

      if (!obj) {
        logger.error('Error saving record:', coin.name);
        continue;
      }

      logger.info('One Record saved successfully:', obj.name);
    }
  } catch (error) {
    logger.error('Error fetching data:', error.message);
  }
};

export { fetchCryptoData };
