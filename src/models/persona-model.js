import { z } from 'zod';

const personaModelo = z.object({
  cedula: z.number(),
  nombre: z.string(),
  primerApellido: z.string(),
  segundoApellido: z.string()
});

export const validarPersona = (object) => {
  return personaModelo.safeParse(object);
};
