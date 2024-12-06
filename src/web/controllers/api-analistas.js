import AnalistasController from '../../controllers/analistas-controller.js';

export class ApiAnalista {
  static async nuevoAnalista (req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const { nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena } = req.body;
      if (!nombre || !primerApellido || !segundoApellido || !personaCedula || !telefono || !correoElectronico || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const result = await AnalistasController.insertarAnalista({ nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena });

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
      const result = await AnalistasController.obtenerListaAnalistas();

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
      const { idanalistaCredito } = req.params; // Verifica que estás accediendo a req.params

      console.log('ID recibido en el backend:', idanalistaCredito); // Depuración

      if (!idanalistaCredito) {
        return res.status(400).json({ message: 'Se requiere el ID del analista' });
      }

      const result = await AnalistasController.eliminarAnalista({ idanalistaCredito });

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
      console.log('Request body received:', req.body); // Debugging

      const {
        personaCedula,
        idanalistaCredito,
        nombre,
        primerApellido,
        segundoApellido,
        telefono,
        correoElectronico,
        contrasena
      } = req.body;

      if (!personaCedula) {
        return res.status(400).json({ message: 'El número de cédula es obligatorio.' });
      }

      // Business logic or database call
      const result = await AnalistasController.modificarAnalista({
        personaCedula,
        idanalistaCredito,
        nombre,
        primerApellido,
        segundoApellido,
        telefono,
        correoElectronico,
        contrasena
      });

      if (result.success) {
        return res.status(200).json({ message: result.message, persona: result.persona });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error('Error in modificarAnalista:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
}

export default ApiAnalista;
