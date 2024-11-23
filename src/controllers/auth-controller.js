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
      SELECT personaCedula
      FROM analistaCredito
      WHERE personaCedula = ?;`, [cedula]);

      if (analista.length > 0) {
        return { success: false, errors: { cedula: ['ya existe un analista registrado con este numero de cedula'] } };
      }

      const encryptedPassword = await bcrypt.hash(contrasena, 10);
      await connection.query(`
        INSERT INTO analistaCredito(telefono, correoElectronico, contrasena, personaCedula)
        VALUES (?, ?, ?, ?);`, [
        telefono,
        correoElectronico,
        encryptedPassword,
        cedula
      ]
      );

      const [analistaNuevo] = await connection.query(`
        SELECT idanalistaCredito, telefono, contrasena, personaCedula
        FROM analistaCredito
        WHERE personaCedula = ?;`, [cedula]
      );

      return { success: true, message: 'Analista creado correctamente', analista: analistaNuevo[0] };
    } catch (e) {
      throw Error('Un error ocurrio al crear el analista');
    }
  }

  static async iniciarSesion ({ personaCedula, contrasena }) {
    try {
      const [analista] = await connection.query(`
        SELECT idanalistaCredito, contrasena, personaCedula
        FROM analistaCredito
        WHERE personaCedula = ?;`, [personaCedula]
      );

      // Verifica si no hay un analista con esa cédula
      if (analista.length === 0) {
        return { success: false, message: 'Número de cédula o contraseña incorrectos' };
      }

      // Extrae la contraseña cifrada y compara
      const { contrasena: hashedPassword } = analista[0];
      console.log('Contraseña cifrada en la base de datos:', hashedPassword); // Verifica este valor
      const isValid = await bcrypt.compare(contrasena, hashedPassword);
      if (!isValid) {
        return { success: false, message: 'Número de cédula o contraseña incorrectos' };
      }

      return { success: true, message: 'Bienvenido', analista: analista[0] };
    } catch (e) {
      console.error(e);
      throw new Error('Un error ocurrió al iniciar sesión');
    }
  }

  static async profile ({ idanalistaCredito }) {
    const [analista] = await connection.query(`
      SELECT idanalistaCredito, telefono, correoElectronico, contrasena, personaCedula
      FROM analistaCredito
      WHERE idanalistaCredito = ?;`, [idanalistaCredito]
    );

    return { success: true, analista: analista[0] };
  }
}
