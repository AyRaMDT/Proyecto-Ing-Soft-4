import { connectDB } from '../database.js';
import jwt from 'jsonwebtoken';

const connection = await connectDB();
const TOKEN_SECRET = 'secretpassword';

export class AuthController {
  static async iniciarSesion ({ personaCedula, contrasena }) {
    try {
      const [analista] = await connection.query(`
        SELECT idanalistaCredito AS id, 'analista' AS rol, contrasena, personaCedula
        FROM analistaCredito
        WHERE personaCedula = ?;`, [personaCedula]
      );

      if (analista.length > 0) {
        const { id, rol, contrasena: storedPassword } = analista[0];

        if (contrasena !== storedPassword) {
          return { success: false, message: 'Número de cédula o contraseña incorrectos' };
        }

        const token = jwt.sign({ id, rol }, TOKEN_SECRET, { expiresIn: '1h' });

        return { success: true, token, message: `Bienvenido, ${rol}`, rol };
      }

      const [cliente] = await connection.query(`
        SELECT personaCedula AS id, 'cliente' AS rol, contrasena, direccion, telefono, correoElectronico
        FROM clientes
        WHERE personaCedula = ?;`, [personaCedula]
      );

      if (cliente.length > 0) {
        const { id, rol, contrasena: storedPassword } = cliente[0];

        if (contrasena !== storedPassword) {
          return { success: false, message: 'Número de cédula o contraseña incorrectos' };
        }

        const token = jwt.sign({ id, rol }, TOKEN_SECRET, { expiresIn: '1h' });

        return { success: true, token, message: `Bienvenido, ${rol}`, rol };
      }

      return { success: false, message: 'Número de cédula o contraseña incorrectos' };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Un error ocurrió al iniciar sesión');
    }
  }

  static async perfil ({ id, rol }) {
    try {
      if (rol === 'analista') {
        const [analista] = await connection.query(`
          SELECT idanalistaCredito, telefono, correoElectronico, personaCedula
          FROM analistaCredito
          WHERE idanalistaCredito = ?;`, [id]
        );

        if (analista.length === 0) {
          return { success: false, message: 'Perfil no encontrado' };
        }

        return { success: true, perfil: { ...analista[0], rol } };
      }

      if (rol === 'cliente') {
        const [cliente] = await connection.query(`
          SELECT  idClientes, personaCedula, direccion, telefono, correoElectronico
          FROM clientes
          WHERE personaCedula = ?;`, [id]
        );

        if (cliente.length === 0) {
          return { success: false, message: 'Perfil no encontrado' };
        }

        return { success: true, perfil: { ...cliente[0], rol } };
      }

      return { success: false, message: 'Rol no válido' };
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      throw new Error('Error al obtener el perfil');
    }
  }
}
