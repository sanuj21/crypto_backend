import express from 'express';
import cron from 'node-cron';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { fetchCryptoData } from './controllers/cryptoController.js';
import router from './routes/routes.js';
import globalErrorHandler from './controllers/errorController.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 1000 * 60 * 60,
    message: 'Too many attempts!! Please try again after one hour',
  }),
);
app.use(cors());

// Schedule the job to run every 2 hours
cron.schedule('* */2 * * *', () => {
  console.log('Fetching cryptocurrency data...');
  fetchCryptoData();
});

app.use(router);

// Error handling middleware
app.use(globalErrorHandler);

export default app;
