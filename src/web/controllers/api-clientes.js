import { ClienteController } from '../../controllers/clientes-controller.js';

export class ApiCliente {
  static async nuevoCliente (req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const { nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico, personaCedula, contrasena } = req.body;

      if (!personaCedula) {
        return res.status(400).json({ error: 'El campo personaCedula es obligatorio.' });
      }

      const result = await ClienteController.insertarCliente({
        nombre,
        primerApellido,
        segundoApellido,
        personaCedula,
        direccion,
        telefono,
        correoElectronico,
        contrasena
      });

      res.status(201).json({ message: result.message });
    } catch (e) {
      console.error('Error en nuevoCliente:', e);
      res.status(500).json({ error: e.message });
    }
  }

  static async listaClientes (req, res) {
    try {
      const result = await ClienteController.obtenerListaClientes();

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ clientes: result.clientes });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async eliminarCliente (req, res) {
    try {
      const { idClientes } = req.query;

      if (!idClientes) {
        return res.status(400).json({ message: 'El ID del cliente es requerido' });
      }

      const result = await ClienteController.eliminarCliente({ idClientes });

      if (result.success && result.affectedRows === 1) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ message: result.message });
      }
    } catch (e) {
      console.error('Error al eliminar el cliente:', e);
      res.status(500).json({ error: e.message });
    }
  }

  static async modificarCliente (req, res) {
    try {
      console.log('Datos recibidos en el backend:', req.body);

      const { idClientes, nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico } = req.body;

      if (!idClientes || !nombre || !primerApellido || !segundoApellido || !direccion || !telefono || !correoElectronico) {
        console.error('Faltan campos requeridos en los datos enviados:', req.body);
        return res.status(400).json({ message: 'Todos los campos son requeridos excepto la contraseña' });
      }

      const result = await ClienteController.modificarCliente({
        idClientes,
        nombre,
        primerApellido,
        segundoApellido,
        direccion,
        telefono,
        correoElectronico
      });

      console.log('Resultado de la llamada al procedimiento:', result);

      if (!result.success) {
        console.error('Error al modificar cliente:', result.message);
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error('Error al modificar cliente:', e.message);
      console.error('Detalles completos del error:', e);
      return res.status(500).json({ error: e.message, stack: e.stack });
    }
  }

  static async leerClientePorId (req, res) {
    try {
      const { idClientes } = req.query;

      if (!idClientes) {
        return res.status(400).json({ message: 'El ID del cliente es requerido' });
      }

      const result = await ClienteController.leerClientePorId(idClientes);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message, cliente: result.cliente });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
