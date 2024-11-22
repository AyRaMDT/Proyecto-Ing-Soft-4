import { connectDB } from '../database.js';
import bcrypt from 'bcrypt';

const connection = await connectDB();

export class AuthController {
  static async registarPersona ({ cedula, nombre, primerApellido, segundoApellido }) {
    try {
      const [persona] = await connection.query(`
      SELECT cedula
      FROM Persona
      WHERE cedula = ?;`, [cedula]);

      if (persona.length > 0) {
        return { success: false, errors: { cedula: ['ya existe un persona registrada con este numero de cedula'] } };
      }
      await connection.query(`
        INSERT INTO Persona(cedula, nombre, primerApellido, segundoApellido)
        VALUES (?, ?, ?, ?);`, [
        cedula,
        nombre,
        primerApellido,
        segundoApellido
      ]);
      const [personaNueva] = await connection.query(`
        SELECT cedula, nombre, primerApellido, segundoApellido
        FROM Persona
        WHERE cedula = ?;`, [cedula]
      );

      return { success: true, message: 'Persona creada correctamente', persona: personaNueva[0] };
    } catch (e) {
      throw Error('Un error ocurrio al crear la Persona');
    }
  }

  static async registarAnalista ({ telefono, correoElectronico, contrasena, cedula }) {
    try {
      const [analista] = await connection.query(`
      SELECT persona_cedula
      FROM analistaCredito
      WHERE persona_cedula = ?;`, [cedula]);

      if (analista.length > 0) {
        return { success: false, errors: { cedula: ['ya existe un analista registrado con este numero de cedula'] } };
      }

      const encryptedPassword = await bcrypt.hash(contrasena, 10);
      await connection.query(`
        INSERT INTO analistaCredito(telefono, correoElectronico, contrasena, persona_cedula)
        VALUES (?, ?, ?, ?);`, [
        telefono,
        correoElectronico,
        encryptedPassword,
        cedula
      ]
      );

      const [analistaNuevo] = await connection.query(`
        SELECT idanalistaCredito, telefono, contrasena, persona_cedula
        FROM analistaCredito
        WHERE persona_cedula = ?;`, [cedula]
      );

      return { success: true, message: 'Analista creado correctamente', analista: analistaNuevo[0] };
    } catch (e) {
      throw Error('Un error ocurrio al crear el analista');
    }
  }

  static async iniciarSesion ({ personaCedula, contrasena }) {
    try {
      const [analista] = await connection.query(`
        SELECT idanalistaCredito, contrasena, persona_cedula
        FROM analistaCredito
        WHERE persona_cedula = ?;`, [personaCedula]
      );

      const { contrasena: hashedPassword } = analista[0];
      const isValid = await bcrypt.compare(contrasena, hashedPassword);

      if (analista.length === 0 || !isValid) {
        return { success: false, message: 'Numero de cedula o contrasenna incorrecta' };
      }

      return { success: true, message: 'Bienvenido', analista: analista[0] };
    } catch (e) {
      throw Error('Un error ocurrio al iniciar sesion');
    }
  }

  static async profile ({ idanalistaCredito }) {
    const [analista] = await connection.query(`
      SELECT idanalistaCredito, telefono, correoElectronico, contrasena, persona_cedula
      FROM analistaCredito
      WHERE idanalistaCredito = ?;`, [idanalistaCredito]
    );

    return { success: true, analista: analista[0] };
  }
}
