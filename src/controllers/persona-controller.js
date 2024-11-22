import { connectDB } from '../database.js';

const connection = await connectDB();

export class PersonaController {
  static async crearPersona ({ cedula, nombre, primerApellido, segundoApellido }) {
    try {
      await connection.query(`
        CALL InsertarPersona(?, ?, ?, ?);
      `, [cedula, nombre, primerApellido, segundoApellido]);

      return { success: true, message: 'Persona creada correctamente' };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al crear la persona');
    }
  }

  static async obtenerListaPersonas () {
    try {
      const [personas] = await connection.query(`
        CALL ObtenerListaPersonas();
      `);

      return personas.length === 0
        ? { success: false, message: 'No se encontraron personas' }
        : { success: true, personas };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al obtener la lista de personas');
    }
  }

  static async eliminarPersona ({ cedula }) {
    try {
      const [rows] = await connection.query(
        `
        CALL EliminarPersona(?);
        `,
        [cedula]
      );

      const { Resultado: mensaje, FilasAfectadas: filasAfectadas } = rows[0][0];

      if (filasAfectadas > 0) {
        return { success: true, message: mensaje };
      }

      return { success: false, message: mensaje };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al eliminar la persona');
    }
  }

  static async modificarPersona ({ cedula, nombre, primerApellido, segundoApellido }) {
    try {
      await connection.query(`
        CALL ModificarPersona(?, ?, ?, ?);
      `, [cedula, nombre, primerApellido, segundoApellido]);

      return { success: true, message: 'Persona modificada correctamente' };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al modificar la persona');
    }
  }
}
