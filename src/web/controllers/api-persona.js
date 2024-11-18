import { PersonaController } from '../../controllers/persona-controller.js';
import { validarPersona } from '../../models/persona-model.js';

export class ApiPersona {
  static async nuevaPersona (req, res) {
    try {
      // aqui se está utilzando zod para validar los datos que
      // se ingresan al sistema coincidan con el modelo.

      const validatedData = await validarPersona(req.body);
      if (validatedData.error) {
        return res.status(400).json({ message: JSON.parse(validatedData.error.message) });
      }

      const { cedula, nombre, primerApellido, segundoApellido } = validatedData.data;

      // se llama al controlador para ingresar la persona
      const createResult = await PersonaController.crearPesona({ cedula, nombre, primerApellido, segundoApellido });

      if (!createResult.success) {
        return res.status(400).json({ errors: 'no se pudo crear la persona' });
      }

      return res.status(201).json({ message: createResult.message, user: createResult.user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async listaPersonas (req, res) {
    try {
      console.log(req.body.cedula);

      const result = await PersonaController.obtenerPersona({ cedula: req.body.cedula });
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(200).json({ persona: result.persona });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
