import express from 'express';
import { personaRouter } from './web/routes/persona-routes.js';
import cors from 'cors';

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// todas la rutas que empiecen con /persona
// utilizan el router de persona
app.use('/persona', personaRouter);

app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
});
