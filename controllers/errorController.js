import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

const handleDublicateErrorDB = (error) => {
  const message = `Already Exist!!!`;
  const statusCode = error.statusCode || 500;
  return new AppError(message, statusCode);
};

const handleValidationErrorDB = (error) => {
  const message = error.message || 'Validation Failed!!';
  const statusCode = error.statusCode || 400;
  return new AppError(message, statusCode);
};

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    err: err.status,
    errror: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    if (err.statusCode === 401) {
      return res.status(err.statusCode).render('login', {
        title: 'Login to Continue!!',
      });
    }

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unknown Error
  logger.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!!',
  });
};

const controller = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};

export default controller;
