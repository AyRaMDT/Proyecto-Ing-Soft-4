import { connectDB } from '../database.js';

const connection = await connectDB();

class AnalistasController {
  static async insertarAnalista ({ nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena }) {
    try {
      console.log('Datos recibidos en Node.js:', { nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena });

      if (!nombre || !primerApellido || !segundoApellido || !personaCedula || !telefono || !correoElectronico || !contrasena) {
        return { success: false, message: 'Todos los campos son requeridos' };
      }

      const connection = await connectDB();
      const [personaNueva] = await connection.query('CALL agregarAnalistaCredito(?, ?, ?, ?, ?, ?, ?, @mensaje)', [
        nombre,
        primerApellido,
        segundoApellido,
        personaCedula,
        telefono,
        correoElectronico,
        contrasena
      ]);

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje as mensaje');

      const cleanedMessage = mensaje.replace(/^Error.*?:(.*)$/, '$1').trim();

      if (mensaje.includes('Éxito')) {
        return { success: true, message: cleanedMessage, persona: personaNueva[0] };
      } else {
        return { success: false, message: cleanedMessage };
      }
    } catch (error) {
      console.error('Error al insertar analista:', error);
      return { success: false, message: 'Ocurrió un error al insertar el analista: ' + error.message };
    }
  }

  static async modificarAnalista ({
    personaCedula,
    idanalistaCredito,
    nombre,
    primerApellido,
    segundoApellido,
    telefono,
    correoElectronico,
    contrasena
  }) {
    try {
      console.log('Llamando al SP con:', {
        personaCedula,
        idanalistaCredito,
        nombre,
        primerApellido,
        segundoApellido,
        telefono,
        correoElectronico,
        contrasena
      });

      const connection = await connectDB();
      const [rows] = await connection.query(
        'CALL modificarAnalistaCredito(?, ?, ?, ?, ?, ?, ?, ?, @mensaje)',
        [
          idanalistaCredito, // INT
          personaCedula, // INT
          nombre, // VARCHAR(65)
          primerApellido, // VARCHAR(65)
          segundoApellido, // VARCHAR(65)
          telefono, // INT
          correoElectronico, // VARCHAR(45)
          contrasena // VARCHAR(45)
        ]
      );

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje AS mensaje');
      console.log('Mensaje del SP:', mensaje);

      if (mensaje.includes('Éxito')) {
        return { success: true, message: mensaje, persona: rows[0] };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error en modificarAnalista:', error);
      return { success: false, message: 'Error al modificar el analista: ' + error.message };
    }
  }

  static async eliminarAnalista ({ idanalistaCredito }) {
    try {
      console.log('ID de analista recibido para eliminación:', idanalistaCredito); // Depuración

      const [rows] = await connection.query('CALL eliminarAnalistaCredito(?, @mensaje)', [idanalistaCredito]);

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje as mensaje');

      if (mensaje.includes('Éxito')) {
        return { success: true, message: mensaje, persona: rows[0] };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (e) {
      console.error('Error al eliminar analista:', e);
      return { success: false, message: 'Ocurrió un error al eliminar el analista: ' + e.message };
    }
  }

  static async obtenerListaAnalistas () {
    try {
      const connection = await connectDB();
      const [rows] = await connection.query('CALL leerAnalistasCredito(@mensaje)');
      const [[{ mensaje }]] = await connection.query('SELECT @mensaje as mensaje');

      if (mensaje.includes('Éxito')) {
        return { success: true, analistas: rows };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error al obtener la lista de analistas:', error);
      return { success: false, message: 'Ocurrió un error al obtener la lista de analistas' };
    }
  }
}

export default AnalistasController;
