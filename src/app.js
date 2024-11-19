import express from 'express';
import { personaRouter } from './web/routes/persona-routes.js';
import { clienteRouter } from './web/routes/clientes-routes.js';
import cors from 'cors';

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));


app.use('/persona', personaRouter);
app.use('/cliente', clienteRouter);

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
});
