import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Router from './routes/Router';
import GlobalErrorHandler from './utils/errors/GlobalErrorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(helmet());
app.use(morgan('tiny'));

// Router
app.use('/api/v1', Router);
app.get('/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/9978541/UVC2J9m4');
});
app.all('*', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.statusCode = 404;
    error.flag = true;
    return next(error);
});

// Error handler
app.use(GlobalErrorHandler);

export default app;
