import { Router } from 'express';
import { ApiAnalista } from '../controllers/api-analistas.js';
export const analistasRouter = Router();

analistasRouter.post('/insertar', ApiAnalista.nuevoAnalista);
analistasRouter.get('/listar', ApiAnalista.listaAnalistas);
analistasRouter.delete('/eliminar/:idanalistaCredito', ApiAnalista.eliminarAnalista);
analistasRouter.put('/modificarAnalista', ApiAnalista.modificarAnalista);
