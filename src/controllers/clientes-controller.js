import { connectDB } from '../database.js';

const connection = await connectDB();

export class ClienteController {
  static async insertarCliente ({ nombre, primerApellido, segundoApellido, personaCedula, direccion, telefono, correoElectronico, contrasena }) {
    try {
      console.log('Parametros recibidos:', { nombre, primerApellido, segundoApellido, personaCedula, direccion, telefono, correoElectronico, contrasena });

      if (!nombre || !primerApellido || !segundoApellido || !personaCedula || !direccion || !telefono || !correoElectronico || !contrasena) {
        throw new Error('Todos los campos son requeridos');
      }

      const [result] = await connection.query(`
        CALL agregarCliente(?, ?, ?, ?, ?, ?, ?, ?, @mensaje);
      `, [nombre, primerApellido, segundoApellido, personaCedula, direccion, telefono, correoElectronico, contrasena]);
      console.log(result);
      const [mensajeResult] = await connection.query('SELECT @mensaje AS mensaje;');
      return { success: true, message: mensajeResult[0].mensaje };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al insertar el cliente');
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
