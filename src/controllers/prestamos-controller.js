import { connectDB } from '../database.js';

const connection = await connectDB();

export class PrestamosController {
  static insertarPrestamo = async ({
    idPrestamo,
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
      // Llamar al procedimiento almacenado
      const [result] = await connection.query(
        'CALL agregarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          idPrestamo,
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

      // Validar si la operación afectó filas
      if (result.affectedRows > 0) {
        return { success: true, message: 'El préstamo ha sido agregado exitosamente.' };
      }

      return { success: false, message: 'No se pudo agregar el préstamo. Verifique los datos.' };
    } catch (error) {
      console.error('Error al insertar el préstamo:', error);
      return { success: false, message: 'Error interno al insertar el préstamo.' };
    }
  };

  static async modificarPrestamo ({ idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula }) {
    try {
      const [resultado] = await connection.query('CALL modificarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @mensaje)', [
        idPrestamos,
        monto,
        plazoMeses,
        fechaInicio,
        numeroPrestamo,
        tasaInteresMoratoria,
        estadoPrestamo,
        diaPago,
        IdClientes,
        clientesPersonaCedula
      ]);

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje AS mensaje');

      if (mensaje.includes('Éxito')) {
        return { success: true, message: mensaje, prestamo: resultado[0] };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error al modificar préstamo:', error);
      return { success: false, message: 'Ocurrió un error al modificar el préstamo: ' + error.message };
    }
  }

  static async eliminarPrestamo ({ idPrestamos }) {
    try {
      console.log('ID de préstamo recibido:', idPrestamos);

      const [resultado] = await connection.query('CALL eliminarPrestamo(?, @mensaje)', [idPrestamos]);

      const [[{ mensaje }]] = await connection.query('SELECT @mensaje AS mensaje');
      console.log(resultado);

      if (mensaje.includes('Éxito')) {
        return { success: true, message: mensaje };
      } else {
        return { success: false, message: mensaje };
      }
    } catch (error) {
      console.error('Error al eliminar préstamo:', error);
      return { success: false, message: 'Ocurrió un error al eliminar el préstamo: ' + error.message };
    }
  }

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
