import { connectDB } from '../database.js';

const connection = await connectDB();

export class ClienteController {
  static async insertarCliente (clienteNuevo) {
    const {
      nombre,
      primerApellido,
      segundoApellido,
      direccion,
      telefono,
      correoElectronico,
      personaCedula,
      contrasena
    } = clienteNuevo;

    try {
      if (!personaCedula) {
        return { success: false, message: 'El campo personaCedula es obligatorio.' };
      }

      await connection.beginTransaction();

      await connection.query(`
        CALL agregarCliente(?, ?, ?, ?, ?, ?, ?, ?, @mensaje);
      `, [nombre, primerApellido, segundoApellido, personaCedula, direccion, telefono, correoElectronico, contrasena]);

      const [result] = await connection.query('SELECT @mensaje AS mensaje');
      const mensaje = result[0]?.mensaje;

      console.log('Mensaje recibido del procedimiento:', mensaje);

      if (mensaje.startsWith('Éxito')) {
        await connection.commit();
        return { success: true, message: mensaje }; // Asegúrate de incluir success: true
      } else {
        await connection.rollback();
        return { success: false, message: mensaje }; // Asegúrate de incluir success: false
      }
    } catch (error) {
      console.error('Error al insertar cliente:', error);

      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Error al revertir la transacción:', rollbackError);
      }

      return { success: false, message: 'Error interno en el servidor.' }; // Incluye success aquí también
    }
  }

  static async obtenerListaClientes () {
    try {
      const [clientes] = await connection.query('CALL leerClientes(@mensaje);');
      const mensaje = clientes[0].mensaje;
      return { success: true, mensaje, clientes: clientes[0] };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }

  static async eliminarCliente ({ idClientes }) {
    try {
      const [result] = await connection.query(`
        CALL eliminarCliente(?, @mensaje);
      `, [idClientes]);

      console.log('Resultado de la eliminación:', result);

      const [messageResult] = await connection.query('SELECT @mensaje AS mensaje');

      if (result.affectedRows === 1) {
        return { success: true, message: messageResult[0].mensaje, affectedRows: result.affectedRows };
      } else {
        return { success: false, message: 'Cliente no encontrado', affectedRows: result.affectedRows };
      }
    } catch (e) {
      console.error('Error al eliminar el cliente:', e);
      throw new Error('Un error ocurrió al eliminar el cliente');
    }
  }

  static async modificarCliente ({ idClientes, nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico }) {
    try {
      const [callResult] = await connection.query(`
        CALL modificarCliente(?, ?, ?, ?, ?, ?, ?, @mensaje);
      `, [idClientes, nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico]);

      const [messageResult] = await connection.query('SELECT @mensaje AS mensaje');

      console.log(callResult);

      if (callResult[0].mensaje === 'Error: Cliente no encontrado.') {
        return { success: false, message: 'Cliente no encontrado' };
      }

      return { success: true, message: messageResult[0].mensaje };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }

  static async leerCliente (req, res) {
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async leerClientePorId (idClientes) {
    try {
      const [callResult] = await connection.query(`
        CALL leerClientesPorId(?, @mensaje);
      `, [idClientes]);

      const [messageResult] = await connection.query('SELECT @mensaje AS mensaje');
      const cliente = callResult[0];

      if (!cliente) {
        return { success: false, message: 'Cliente no encontrado' };
      }

      return { success: true, cliente, message: messageResult[0].mensaje };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }
}
