import { PagosController } from '../../controllers/pagos-controller.js';

export class ApiPago {
  static async registrarPago (req, res) {
    try {
      // Obtenemos los datos del cuerpo de la solicitud
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

      // console.log(req.body);
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
}
