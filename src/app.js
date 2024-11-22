import express from 'express';
// import { personaRouter } from './web/routes/persona-routes.js';
// import { clienteRouter } from './web/routes/clientes-routes.js';
// import { analistasRouter } from './web/routes/analistas-routes.js';
import cors from 'cors';
import { authRouter } from './web/routes/auth-routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3333;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: '*',
  credentials: true
}));

// app.use('/persona', personaRouter);
// app.use('/cliente', clienteRouter);
// app.use('/analistas', analistasRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
});
