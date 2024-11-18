import { Router } from 'express';
import { ApiPersona } from '../controllers/api-persona.js';

export const personaRouter = Router();

personaRouter.post('/crear-persona', ApiPersona.nuevaPersona);
personaRouter.get('/obtener-persona', ApiPersona.listaPersonas);
