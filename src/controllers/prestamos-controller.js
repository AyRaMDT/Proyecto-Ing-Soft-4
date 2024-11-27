import { connectDB } from '../database.js';

const connection = await connectDB();
export class PrestamosController {
  static insertarPrestamo = async ({
    monto,
    plazoMeses,
    fechaInicio,
    numeroPrestamo,
    tasaInteresMoratoria,
    fechaVencimiento,
    diaPago,
    IdClientes,
    clientesPersonaCedula
  }) => {
    try {
      const [result] = await connection.query(
        'CALL agregarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          monto,
          plazoMeses,
          fechaInicio,
          numeroPrestamo,
          tasaInteresMoratoria,
          fechaVencimiento,
          diaPago,
          IdClientes,
          clientesPersonaCedula
        ]
      );

      if (result && result[0] && result[0][0].success === 1) {
        return { success: true, message: result[0][0].message };
      }

      return { success: false, message: 'No se pudo agregar el préstamo. Verifique los datos.' };
    } catch (error) {
      console.error('Error al insertar el préstamo:', error);
      return { success: false, message: 'Error interno al insertar el préstamo.' };
    }
  };

  static async obtenerListaPrestamos () {
    try {
      const [prestamos] = await connection.query('CALL obtenerPrestamos(@mensaje)');
      const [[{ mensaje }]] = await connection.query('SELECT @mensaje AS mensaje');

      if (mensaje.includes('Éxito')) {
        return { success: true, prestamos };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error al obtener lista de préstamos:', error);
      return { success: false, message: 'Ocurrió un error al obtener la lista de préstamos' };
    }
  }

  static async obtenerUltimoPrestamo () {
    try {
      // Llamada al procedimiento almacenado
      await connection.query('CALL obtenerUltimoPrestamo(@ultimoPrestamo)');

      // Obtener el valor del parámetro de salida
      const [[{ ultimoPrestamo }]] = await connection.query('SELECT @ultimoPrestamo AS ultimoPrestamo');

      if (ultimoPrestamo) {
        return { success: true, ultimoPrestamo };
      } else {
        return { success: false, message: 'No se encontró ningún préstamo registrado.' };
      }
    } catch (error) {
      console.error('Error en obtenerUltimoPrestamo:', error);
      return { success: false, message: 'Error al ejecutar el procedimiento almacenado.' };
    }
  }
}

export default PrestamosController;
