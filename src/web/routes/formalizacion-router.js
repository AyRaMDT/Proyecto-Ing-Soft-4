import { Router } from 'express';
import { ApiFormalizacion } from '../controllers/api-formalizacion.js';

export const FormalizacionRouter = Router();

FormalizacionRouter.post('/agregar', ApiFormalizacion.agregar);
FormalizacionRouter.get('/listar', ApiFormalizacion.obtenerTodos);
FormalizacionRouter.get('/listarTODO', ApiFormalizacion.obtenerPrestamosFormalizados);
FormalizacionRouter.put('/modificar', ApiFormalizacion.actualizar);
FormalizacionRouter.put('/modificarTODO', ApiFormalizacion.modificarPrestamoFormalizado);
FormalizacionRouter.delete('/eliminar/:id', ApiFormalizacion.eliminar);
FormalizacionRouter.delete('/rechazar', ApiFormalizacion.rechazarPrestamoFormalizado);
