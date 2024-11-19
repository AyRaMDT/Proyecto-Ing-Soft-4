import { connectDB } from '../database.js';

const connection = await connectDB();

export class ClienteController {
  

    static async insertarCliente({ direccion, telefono, correoElectronico, Persona_Cedula, contrasena }) {
        try {
          console.log('Parametros recibidos:', { direccion, telefono, correoElectronico, Persona_Cedula, contrasena });
      
          if (!direccion || !telefono || !correoElectronico || !Persona_Cedula || !contrasena) {
            throw new Error('Todos los campos son requeridos');
          }
      
        
          await connection.query(`
            CALL InsertarCliente(?, ?, ?, ?, ?);
          `, [direccion, telefono, correoElectronico, Persona_Cedula, contrasena]);
      
          return { success: true, message: 'Cliente insertado correctamente' };
        } catch (e) {
          console.error(e);
          throw new Error('Un error ocurrió al insertar el cliente');
        }
      }
      
      
  static async obtenerListaClientes() {

    try {
      const [clientes] = await connection.query('CALL ObtenerListaClientes();');
      return { success: true, clientes };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  }


  static async eliminarCliente({ Persona_Cedula }) {
    try {
      const [rows] = await connection.query(`
        CALL EliminarCliente(?);
      `, [Persona_Cedula]);

      const { Resultado: mensaje, FilasAfectadas: filasAfectadas } = rows[0][0];

      if (filasAfectadas > 0) {
        return { success: true, message: mensaje };
      }

      return { success: false, message: mensaje };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al eliminar el cliente');
    }
  }

  static async modificarCliente({ Persona_Cedula, direccion, telefono, correoElectronico, contrasena }) {
    try {
      await connection.query(`
        CALL ModificarCliente(?, ?, ?, ?, ?);
      `, [Persona_Cedula, direccion, telefono, correoElectronico, contrasena]);

      return { success: true, message: 'Cliente modificado correctamente' };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al modificar el cliente');
    }
  }
}
