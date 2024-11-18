import { connectDB } from '../database.js';

const connection = await connectDB();

export class PersonaController {
  static async crearPesona ({ cedula, nombre, primerApellido, segundoApellido }) {
    try {
      await connection.query(`
        INSERT INTO Persona(cedula, nombre, primerApellido, segundoApellido)
        VALUES (?, ?, ?, ?);`, [cedula, nombre, primerApellido, segundoApellido]
      );

      return { success: true, message: 'Persona creada correctamente' };
    } catch (e) {
      throw Error('Un error ocurrio al crear una persona');
    }
  }

  static async obtenerPersona ({ cedula }) {
    try {
      const [persona] = await connection.query(`
        SELECT cedula, nombre, primerApellido, segundoApellido
        FROM Persona
        WHERE cedula = ?;`, [cedula]
      );

      return persona.length === 0
        ? { success: false, message: 'Persona no encontrada' }
        : { success: true, persona: persona[0] };
    } catch (error) {
      throw Error('Un error ocurrio al obtener la persona');
    }
  }
}
