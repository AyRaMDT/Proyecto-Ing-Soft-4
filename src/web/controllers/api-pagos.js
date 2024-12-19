import { PagosController } from '../../controllers/pagos-controller.js';

export class ApiPago {
  static async registrarPago (req, res) {
    try {
      const {
        fechaPago,
        montoPagado,
        medioPago,
        intereses,
        amortizacion,
        cuotaPago,
        numeroPagos,
        idPrestamos
      } = req.body;

      if (
        fechaPago === undefined ||
        montoPagado === undefined ||
        medioPago === undefined ||
        intereses === undefined ||
        amortizacion === undefined ||
        cuotaPago === undefined ||
        numeroPagos === undefined ||
        idPrestamos === undefined
      ) {
        console.log('Campos faltantes:', {
          fechaPago,
          montoPagado,
          medioPago,
          intereses,
          amortizacion,
          cuotaPago,
          numeroPagos,
          idPrestamos
        });
        return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
      }

      const result = await PagosController.agregarPago({
        fechaPago,
        montoPagado,
        medioPago,
        intereses,
        amortizacion,
        cuotaPago,
        numeroPagos,
        idPrestamos
      });

      console.log(result);

      if (result.success) {
        return res.status(200).json({
          mensaje: 'Pago registrado con éxito',
          saldoRestante: result.saldoRestante
        });
      }

      return res.status(400).json({ mensaje: result.message });
    } catch (error) {
      console.error('Error en el registro del pago:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  static async listaPagos (req, res) {
    try {
      const idCliente = req.query.idCliente || null;

      const result = await PagosController.obtenerListaPagos(idCliente);

      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }

      if (result.prestamos.length === 0) {
        return res.status(404).json({ message: result.mensaje });
      }

      res.status(200).json({
        prestamos: result.prestamos,
        mensaje: result.mensaje
      });
    } catch (e) {
      console.error('Error en listaPrestamos:', e);
      res.status(500).json({ error: e.message });
    }
  }

  static async listaPagosporID (req, res) {
    try {
      const idCliente = req.query.idCliente || null;

      if (!idCliente) {
        console.log('Falta idCliente en la solicitud'); // Log de validación
        return res.status(400).json({ message: 'El idCliente es obligatorio.' });
      }

      console.log(`Llamando a obtenerListaPagosporID con idCliente: ${idCliente}`); // Log del parámetro

      const result = await PagosController.obtenerListaPagosporID(idCliente);

      if (!result.success) {
        console.log('Fallo en obtenerListaPagosporID:', result.message); // Log del mensaje de error
        return res.status(500).json({ message: result.message });
      }

      if (result.pagos.length === 0) {
        console.log('No se encontraron pagos:', result.mensaje); // Log de resultado vacío
        return res.status(404).json({ message: result.mensaje });
      }

      console.log('Pagos obtenidos:', result.pagos); // Log de los pagos obtenidos
      res.status(200).json({
        pagos: result.pagos,
        mensaje: result.mensaje
      });
    } catch (error) {
      console.error('Error en listaPagosporID:', error); // Log del error
      res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
  }
}
