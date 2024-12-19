import { connectDB } from '../database.js';

const connection = await connectDB();
export class PagosController {
  static agregarPago = async ({ fechaPago, montoPagado, medioPago, intereses, amortizacion, cuotaPago, numeroPagos, idPrestamos }) => {
    try {
      const [prestamos] = await connection.query(
        'SELECT * FROM prestamoscliente WHERE idPrestamos = ?',
        [idPrestamos]
      );

      const prestamo = prestamos.length > 0 ? prestamos[0] : null;

      if (!prestamo) {
        return { success: false, message: 'El préstamo no existe o no tiene datos válidos.' };
      }

      console.log('Prestamo obtenido:', prestamo);

      const saldoActual = parseFloat(prestamo.saldo);
      const amortizacionNumerica = parseFloat(amortizacion);

      if (isNaN(saldoActual) || isNaN(amortizacionNumerica)) {
        console.log('Datos inválidos:', { saldoActual, amortizacionNumerica });
        return { success: false, message: 'Datos inválidos para calcular el saldo.' };
      }

      const [pagoExistente] = await connection.query(
        'SELECT * FROM pagos WHERE numeroPagos = ? AND idPrestamos = ? AND montoPagado = ?',
        [numeroPagos, idPrestamos, montoPagado]
      );

      if (pagoExistente.length > 0) {
        console.log('Pago duplicado:', pagoExistente);
        return { success: false, message: 'El pago ya ha sido registrado.' };
      }

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

      const saldoActualizado = saldoActual - amortizacionNumerica;

      console.log('Saldo Actualizado:', saldoActualizado);

      await connection.query(
        'UPDATE prestamoscliente SET saldo = ? WHERE idPrestamos = ?',
        [saldoActualizado, idPrestamos]
      );

      const [updateResult] = await connection.query(
        'UPDATE formalizacionprestamo SET estadoPrestamoPago = "Pagado" WHERE prestamoscliente_idPrestamos = ?',
        [idPrestamos]
      );

      if (updateResult.affectedRows > 0) {
        console.log('Estado de préstamo actualizado a "Pagado".');
      } else {
        console.log('No se encontró ningún registro para actualizar.');
      }

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

  static async obtenerListaPagosporID (idCliente = null) {
    try {
      console.log(`Ejecutando leerPagosporID con idCliente: ${idCliente}`); // Log del parámetro

      const [result] = await connection.query('CALL leerPagosporID(?);', [idCliente]);

      console.log('Resultado del procedimiento:', result); // Log del resultado

      if (!result || result.length === 0) {
        return {
          success: false,
          message: idCliente
            ? 'No se encontraron pagos para el cliente indicado.'
            : 'No se encontraron pagos.'
        };
      }

      const pagos = result;
      const mensaje = pagos[0]?.mensaje || 'Consulta realizada correctamente.';

      return { success: true, mensaje, pagos };
    } catch (error) {
      console.error('Error al obtener los pagos:', error); // Log del error
      return { success: false, message: 'Error al ejecutar el procedimiento almacenado leerPagos.' };
    }
  }
}
