import { Router } from 'express';
import { ApiFormalizacion } from '../controllers/api-formalizacion.js';

export const FormalizacionRouter = Router();

FormalizacionRouter.post('/agregar', ApiFormalizacion.agregar);
FormalizacionRouter.get('/listar', ApiFormalizacion.obtenerTodos);
FormalizacionRouter.put('/modificar', ApiFormalizacion.actualizar);
FormalizacionRouter.delete('/eliminar/:id', ApiFormalizacion.eliminar);
