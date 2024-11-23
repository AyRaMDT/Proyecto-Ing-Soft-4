import { connectDB } from '../database.js';

const connection = await connectDB();

export class ClienteController {
  static async insertarCliente (clienteNuevo) {
    const { nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico, personaCedula, contrasena } = clienteNuevo;

    try {
      console.log('Datos enviados para insertar cliente:', {
        nombre,
        primerApellido,
        segundoApellido,
        direccion,
        telefono,
        correoElectronico,
        personaCedula,
        contrasena
      });

      if (!personaCedula) {
        throw new Error('El campo personaCedula es obligatorio.');
      }

      await connection.beginTransaction();

      const [result1] = await connection.query(`
          INSERT INTO persona (cedula, Nombre, PrimerApellido, SegundoApellido)
          VALUES (?, ?, ?, ?)
        `, [personaCedula, nombre, primerApellido, segundoApellido]);

      console.log('Cliente insertado en la tabla persona:', result1);

      const [result2] = await connection.query(`
          INSERT INTO clientes (personaCedula, direccion, telefono, correoElectronico, contrasena)
          VALUES (?, ?, ?, ?, ?)
        `, [personaCedula, direccion, telefono, correoElectronico, contrasena]);

      console.log('Cliente insertado en la tabla clientes:', result2);

      await connection.commit();

      return { success: true, message: 'Cliente registrado exitosamente.' };
    } catch (error) {
      await connection.rollback();
      console.error('Error al insertar cliente:', error);
      return { success: false, message: 'Error: No se pudo agregar el registro.' };
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
      console.log(result);

      const [messageResult] = await connection.query('SELECT @mensaje AS mensaje');

      if (messageResult[0].mensaje === 'Cliente no encontrado') {
        return { success: false, message: 'Cliente no encontrado' };
      }

      return { success: true, message: messageResult[0].mensaje };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al eliminar el cliente');
    }
  }

  static async modificarCliente ({ idClientes, nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico, contrasena }) {
    try {
      const [callResult] = await connection.query(`
        CALL modificarCliente(?, ?, ?, ?, ?, ?, ?, ?, @mensaje);
      `, [idClientes, nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico, contrasena]);
      console.log(callResult);
      console.log('ID Cliente:', idClientes);
      const [messageResult] = await connection.query('SELECT @mensaje AS mensaje');

      if (messageResult[0].mensaje === 'Cliente no encontrado') {
        return { success: false, message: 'Cliente no encontrado' };
      }
      return { success: true, message: messageResult[0].mensaje };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  }
}
