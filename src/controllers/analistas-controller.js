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
      const [rows] = await connection.query('CALL agregarAnalistaCredito(?, ?, ?, ?, ?, ?, ?, @mensaje)', [
        nombre,
        primerApellido,
        segundoApellido,
        personaCedula,
        telefono,
        correoElectronico,
        contrasena
      ]);

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje as mensaje');

      if (mensaje.includes('Éxito')) {
        return { success: true, message: mensaje, persona: rows[0] };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error al insertar analista:', error);
      return { success: false, message: 'Ocurrió un error al insertar el analista: ' + error.message };
    }
  }

  static async modificarAnalista ({ idanalistaCredito, nombre, primerApellido, segundoApellido, telefono, correoElectronico, contrasena }) {
    try {
      const connection = await connectDB();
      const [rows] = await connection.query('CALL modificarAnalistaCredito(?, ?, ?, ?, ?, ?, ?, @mensaje)', [
        idanalistaCredito,
        nombre,
        primerApellido,
        segundoApellido,
        telefono,
        correoElectronico,
        contrasena
      ]);

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje as mensaje');

      if (mensaje.includes('Éxito')) {
        return { success: true, message: mensaje, persona: rows[0] };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error al modificar analista:', error);
      return { success: false, message: 'Ocurrió un error al modificar el analista: ' + error.message };
    }
  }

  static async eliminarAnalista ({ idanalistaCredito }) {
    try {
      console.log('ID de analista recibido:', idanalistaCredito);

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
