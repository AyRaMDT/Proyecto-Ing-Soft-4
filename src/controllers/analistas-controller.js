import { connectDB } from '../database.js';

const connection = await connectDB();

class AnalistasController {
  static async insertarAnalista ({ telefono, correoElectronico, contrasena, Persona_Cedula }) {
    try {
      console.log('Datos recibidos en Node.js:', { telefono, correoElectronico, contrasena, Persona_Cedula });

      if (!telefono || !correoElectronico || !contrasena || !Persona_Cedula) {
        return { success: false, message: 'Todos los campos son requeridos' };
      }

      const connection = await connectDB();
      const [rows] = await connection.query('CALL InsertarAnalistaCredito(?, ?, ?, ?)', [
        telefono,
        correoElectronico,
        contrasena,
        Persona_Cedula
      ]);

      console.log('Resultado de la consulta:', rows);

      if (rows && rows.length > 0 && rows[0].filas_afectadas > 0) {
        return { success: true, message: 'Analista insertado correctamente' };
      } else {
        return { success: false, message: 'No se pudo insertar el analista' };
      }
    } catch (error) {
      console.error('Error al insertar analista:', error);
      return { success: false, message: 'Ocurrió un error al insertar el analista: ' + error.message };
    }
  }

  static async modificarAnalista ({ idanalistaCredito, telefono, correoElectronico, contrasena, Persona_Cedula }) {
    try {
      const connection = await connectDB();
      const [rows] = await connection.query('CALL ModificarAnalistaCredito(?, ?, ?, ?, ?)', [
        idanalistaCredito,
        telefono,
        correoElectronico,
        contrasena,
        Persona_Cedula
      ]);

      if (rows.length > 0 && rows[0].resultado) {
        return { success: true, message: rows[0].resultado };
      } else {
        return { success: false, message: 'Analista modificado correctamente' };
      }
    } catch (error) {
      console.error('Error al modificar analista:', error);
      return { success: false, message: `Error: ${error.message}` };
    }
  }

  static async eliminarAnalista ({ personaCedula }) {
    try {
      console.log('Cédula recibida:', personaCedula);

      const [rows] = await connection.query(`
            CALL EliminarAnalistaCredito(?);
        `, [personaCedula]);

      console.log('Resultado de la consulta:', rows);

      const { Resultado: mensaje, FilasAfectadas: filasAfectadas } = rows[0][0];

      if (filasAfectadas > 0) {
        return { success: true, message: mensaje };
      }

      return { success: false, message: mensaje };
    } catch (e) {
      console.error('Error al eliminar analista:', e);
      throw new Error('Un error ocurrió al eliminar el analista');
    }
  }

  static async obtenerListaAnalistas () {
    try {
      const connection = await connectDB();
      const [analistas] = await connection.query('CALL ObtenerListaAnalistas()');
      return { success: true, analistas };
    } catch (error) {
      console.error('Error al obtener los analistas:', error);
      return { success: false, message: 'Ocurrió un error al obtener los analistas' };
    }
  }
}

export default AnalistasController;
