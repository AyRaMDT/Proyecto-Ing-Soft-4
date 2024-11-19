import { PersonaController } from '../../controllers/persona-controller.js';

export class ApiPersona {
  
  // Función para crear una persona
  static async nuevaPersona(req, res) {
    try {
      const { cedula, nombre, primerApellido, segundoApellido } = req.body;
      
      // Llamar al controlador para crear la persona
      const result = await PersonaController.crearPersona({ cedula, nombre, primerApellido, segundoApellido });
      
      res.status(201).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  // Función para obtener la lista de personas
  static async listaPersonas(req, res) {
    try {
      const result = await PersonaController.obtenerListaPersonas();
      
      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ personas: result.personas });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
  static async eliminarPersona(req, res) {
    try {
      const { cedula } = req.query; // Obtener la cédula desde el query string
  
   
      const result = await PersonaController.eliminarPersona({ cedula });
  
   
      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }
  
    
      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
  


  static async modificarPersona(req, res) {
    try {
      const { cedula, nombre, primerApellido, segundoApellido } = req.body;

      const result = await PersonaController.modificarPersona({ cedula, nombre, primerApellido, segundoApellido });

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}

