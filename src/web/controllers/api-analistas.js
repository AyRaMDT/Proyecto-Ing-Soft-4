import AnalistaController from '../../controllers/analistas-controller.js';

export class ApiAnalista {
  static async nuevoAnalista (req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const { telefono, correoElectronico, contrasena, Persona_Cedula } = req.body;

      const result = await AnalistaController.insertarAnalista({ telefono, correoElectronico, contrasena, Persona_Cedula });

      if (result.success) {
        return res.status(201).json({ message: result.message });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async listaAnalistas (req, res) {
    try {
      const result = await AnalistaController.obtenerListaAnalistas();

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ analistas: result.analistas });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async eliminarAnalista (req, res) {
    try {
      const { personaCedula } = req.query;

      if (!personaCedula) {
        return res.status(400).json({ message: 'Se requiere la cédula de la persona' });
      }

      const result = await AnalistaController.eliminarAnalista({ personaCedula });

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (e) {
      console.error('Error al eliminar analista:', e);
      res.status(500).json({ message: e.message });
    }
  }

  static async modificarAnalista (req, res) {
    try {
      console.log(req.body);

      const { personaCedula, telefono, correoElectronico, contrasena, Persona_Cedula } = req.body;

      if (!personaCedula || !telefono || !correoElectronico || !contrasena || !Persona_Cedula) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const result = await AnalistaController.modificarAnalista({
        personaCedula,
        telefono,
        correoElectronico,
        contrasena,
        Persona_Cedula
      });

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
