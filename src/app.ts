import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { clothesRouter } from './routers/clothes.routes.js';
import createDebug from 'debug';
import { errorMiddleware } from './middleware/error.middleware.js';
import { usersRouter } from './routers/users.routes.js';

const debug = createDebug('EPV:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/clothes', clothesRouter);
app.use('/users', usersRouter);

app.use(errorMiddleware);
