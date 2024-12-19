import { Router } from 'express';
import { ApiPago } from '../controllers/api-pagos.js';

export const PagosRouter = Router();

PagosRouter.post('/realizarPago', ApiPago.registrarPago);
PagosRouter.get('/listaPagos', ApiPago.listaPagos);
PagosRouter.get('/listaPagosporID', ApiPago.listaPagosporID);
