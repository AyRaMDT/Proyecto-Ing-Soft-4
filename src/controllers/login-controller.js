import sql from 'mssql';
import { connectDB } from '../database.js';

export class LoginController {
  static async autenticarUsuario ({ idUsuario, contrasena }) {
    try {
      const bd = await connectDB();
      const request = bd.request();

      request.input('idUsuario', sql.VarChar, idUsuario);
      request.input('contrasena', sql.VarChar, contrasena);

      const resultado = await request.query(`
        SELECT Persona_Cedula, 'cliente' AS rol 
        FROM Clientes 
        WHERE Persona_Cedula = @idUsuario AND contrasena = @contrasena
        UNION
        SELECT Persona_Cedula, 'analistaCredito' AS rol 
        FROM analistaCredito 
        WHERE Persona_Cedula = @idUsuario AND contrasena = @contrasena
      `);

      const usuario = resultado.recordset[0];
      if (usuario) {
        return { success: true, usuario };
      }

      return { success: false, message: 'Credenciales incorrectas' };
    } catch (error) {
      console.error('Error en la autenticación:', error);
      throw new Error('Error interno del servidor');
    }
  }
}
