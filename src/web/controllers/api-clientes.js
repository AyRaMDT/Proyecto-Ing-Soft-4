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

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async modificarCliente (req, res) {
    try {
      const { idClientes, nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico, personaCedula, contrasena } = req.body;

      if (!nombre || !primerApellido || !segundoApellido || !direccion || !telefono || !correoElectronico || !personaCedula || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const result = await ClienteController.modificarCliente({
        idClientes,
        nombre,
        primerApellido,
        segundoApellido,
        direccion,
        telefono,
        correoElectronico,
        personaCedula,
        contrasena
      });

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
