import { Router } from 'express';
import { ApiPrestamo } from '../controllers/api-prestamos.js';

export const PrestamosRouter = Router();

PrestamosRouter.post('/nuevoPrestamo', ApiPrestamo.nuevoPrestamo);
PrestamosRouter.get('/listaPrestamos', ApiPrestamo.listaPrestamos);
PrestamosRouter.delete('/eliminarPrestamo', ApiPrestamo.eliminarPrestamo);
PrestamosRouter.put('/actualizarPrestamo', ApiPrestamo.actualizarPrestamo);
PrestamosRouter.get('/obtenerultimo', ApiPrestamo.ultimoPrestamo);
PrestamosRouter.get('/prestamoporcedula/:personaCedula', ApiPrestamo.obtenerPrestamosPorCedula);
