import { connectDB } from '../database.js';

const connection = await connectDB();
export class PagosController {
  static agregarPago = async ({ fechaPago, montoPagado, medioPago, intereses, amortizacion, cuotaPago, numeroPagos, idPrestamos }) => {
    try {
      // Validar que el préstamo exista y obtener los datos
      const [prestamos] = await connection.query(
        'SELECT * FROM prestamoscliente WHERE idPrestamos = ?',
        [idPrestamos]
      );

      const prestamo = prestamos.length > 0 ? prestamos[0] : null;

      if (!prestamo) {
        return { success: false, message: 'El préstamo no existe o no tiene datos válidos.' };
      }

      console.log('Prestamo obtenido:', prestamo);

      // Validar que el saldo sea numérico y amortización esté definida
      const saldoActual = parseFloat(prestamo.saldo);
      const amortizacionNumerica = parseFloat(amortizacion);

      if (isNaN(saldoActual) || isNaN(amortizacionNumerica)) {
        console.log('Datos inválidos:', { saldoActual, amortizacionNumerica });
        return { success: false, message: 'Datos inválidos para calcular el saldo.' };
      }

      // Validar que el pago no sea duplicado
      const [pagoExistente] = await connection.query(
        'SELECT * FROM pagos WHERE numeroPagos = ? AND idPrestamos = ? AND montoPagado = ?',
        [numeroPagos, idPrestamos, montoPagado]
      );

      console.log('Pago existente encontrado:', pagoExistente);

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
        return { success: false, message: 'No se pudo agregar el pago. Verifique los datos.' };
      }

      // Actualizar el saldo restando la amortización
      const saldoActualizado = saldoActual - amortizacionNumerica;

      console.log('Saldo Actualizado:', saldoActualizado);

      await connection.query(
        'UPDATE prestamoscliente SET saldo = ? WHERE idPrestamos = ?',
        [saldoActualizado, idPrestamos]
      );

      return { success: true, message: 'Pago registrado y saldo actualizado correctamente.' };
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      return { success: false, message: 'Error interno al insertar el pago.' };
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
