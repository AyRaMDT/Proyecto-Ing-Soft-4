import express from 'express';
import { clienteRouter } from './web/routes/clientes-routes.js';
import { analistasRouter } from './web/routes/analistas-routes.js';
import { PrestamosRouter } from './web/routes/prestamos-routes.js';
import { FormalizacionRouter } from './web/routes/formalizacion-router.js';
import cors from 'cors';
import { authRouter } from './web/routes/auth-routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3333;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/cliente', clienteRouter);
app.use('/analistas', analistasRouter);
app.use('/prestamos', PrestamosRouter);
app.use('/formalizacion', FormalizacionRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
});
