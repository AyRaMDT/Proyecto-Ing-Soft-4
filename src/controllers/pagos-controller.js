import { connectDB } from '../database.js';

const connection = await connectDB();
export class PagosController {
  static agregarPago = async ({ fechaPago, montoPagado, medioPago, intereses, amortizacion, cuotaPago, numeroPagos, idPrestamos }) => {
    try {
      // Validar que el préstamo exista
      const [prestamo] = await connection.query(
        'SELECT * FROM prestamoscliente WHERE idPrestamos = ?',
        [idPrestamos]
      );

      if (!prestamo) {
        return { success: false, message: 'El prestamo no existe' };
      }

      // Insertar el nuevo pago
      const [result] = await connection.query(
        'CALL agregarPago(?, ?, ?, ?, ?, ?, ?, ?)',
        [
          fechaPago,
          montoPagado,
          medioPago,
          intereses,
          amortizacion,
          cuotaPago,
          numeroPagos,
          idPrestamos
        ]
      );

      if (result.length === 0) {
        return { success: false, message: 'No se pudo agregar el préstamo. Verifique los datos.' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      return { success: false, message: 'Error interno al insertar el préstamo.' };
    }
  };

  static async obtenerListaPagos (idCliente = null) {
    try {
      const [result] = await connection.query('CALL leerPagos(?);', [idCliente]);

      if (!result || result.length === 0) {
        return { success: false, message: 'No se encontraron datos.' };
      }

      const prestamos = result;
      const mensaje = prestamos[0]?.mensaje || 'Consulta realizada correctamente.';

      return { success: true, mensaje, prestamos };
    } catch (error) {
      console.error('Error al obtener los pagos:', error);
      return { success: false, message: 'Error al ejecutar el SP leerPagos.' };
    }
  }
}
