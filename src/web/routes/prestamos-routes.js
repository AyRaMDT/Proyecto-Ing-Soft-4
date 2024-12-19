import { Router } from 'express';
import { ApiPrestamo } from '../controllers/api-prestamos.js';

export const PrestamosRouter = Router();

PrestamosRouter.post('/nuevoPrestamo', ApiPrestamo.nuevoPrestamo);
PrestamosRouter.get('/listaPrestamos', ApiPrestamo.listaPrestamos);
PrestamosRouter.delete('/eliminarPrestamo', ApiPrestamo.eliminarPrestamo);
PrestamosRouter.put('/actualizarPrestamo', ApiPrestamo.actualizarPrestamo);
PrestamosRouter.get('/obtenerultimo', ApiPrestamo.ultimoPrestamo);
PrestamosRouter.get('/solicitudes', ApiPrestamo.listaSolicitudesPrestamosPorFecha);
PrestamosRouter.get('/listarID', ApiPrestamo.listaPrestamosporID);

PrestamosRouter.get('/prestamoporcedula/:personaCedula', ApiPrestamo.obtenerPrestamosPorCedula);
PrestamosRouter.get('/filtroPrestamo', ApiPrestamo.listaPrestamosPorFecha);
PrestamosRouter.put('/aprobar', ApiPrestamo.aprobar);
PrestamosRouter.put('/rechazar', ApiPrestamo.rechazar);
