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
    clientesPersonaCedula,
    estadoPrestamo
  }) => {
    try {
      const [result] = await connection.query(
        'CALL agregarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          monto,
          plazoMeses,
          fechaInicio,
          numeroPrestamo,
          tasaInteresMoratoria,
          fechaVencimiento,
          diaPago,
          IdClientes,
          clientesPersonaCedula,
          estadoPrestamo
        ]
      );

      console.log(result);

      if (result && result[0][0]['ROW_COUNT()'] > 0) {
        return { success: true, message: 'El préstamo ha sido agregado exitosamente.' };
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
}

export default PrestamosController;