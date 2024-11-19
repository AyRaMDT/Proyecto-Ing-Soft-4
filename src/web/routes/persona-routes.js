import { Router } from 'express';
import { ApiPersona } from '../controllers/api-persona.js'; // Asegúrate de importar el controlador correctamente

export const personaRouter = Router();

// Ruta para crear una persona
personaRouter.post('/crear-persona', ApiPersona.nuevaPersona);


personaRouter.get('/obtener-persona', ApiPersona.listaPersonas);

personaRouter.delete('/eliminar-persona', ApiPersona.eliminarPersona);


personaRouter.put('/modificar-persona', ApiPersona.modificarPersona);
