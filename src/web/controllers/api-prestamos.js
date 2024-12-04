import { PrestamosController } from '../../controllers/prestamos-controller.js';

export class ApiPrestamo {
  static async nuevoPrestamo (req, res) {
    try {
      console.log('Datos enviados en nuevoPrestamo:', req.body);

      const { monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula } = req.body;

      if (isNaN(Number(clientesPersonaCedula))) {
        return res.status(400).json({ error: 'El campo clientesPersonaCedula debe ser un número válido.' });
      }
      console.log('Valor recibido para clientesPersonaCedula:', clientesPersonaCedula, 'Tipo:', typeof clientesPersonaCedula);

      if (!monto || !plazoMeses || !fechaInicio || !numeroPrestamo || !tasaInteresMoratoria || !estadoPrestamo || !diaPago || !IdClientes || !clientesPersonaCedula) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(plazoMeses));

      const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];
      console.log('Fecha de vencimiento calculada:', fechaVencimientoStr);

      const result = await PrestamosController.insertarPrestamo({
        monto,
        plazoMeses,
        fechaInicio,
        fechaVencimiento: fechaVencimientoStr,
        numeroPrestamo,
        tasaInteresMoratoria,
        diaPago,
        IdClientes,
        clientesPersonaCedula
      });

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      return res.status(201).json({ message: result.message });
    } catch (e) {
      console.error('Error en nuevoPrestamo:', e);
      return res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
  }

  static async listaPrestamos (req, res) {
    try {
      const result = await PrestamosController.obtenerListaPrestamos();

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ prestamos: result.prestamos });
    } catch (e) {
      console.error('Error en listaPrestamos:', e);
      res.status(500).json({ error: e.message });
    }
  }

  static async eliminarPrestamo (req, res) {
    try {
      // Capturar el ID desde los parámetros de consulta
      const { idPrestamos } = req.query;

      console.log('ID recibido desde la URL (query):', idPrestamos);

      if (!idPrestamos) {
        return res.status(400).json({ message: 'El ID del préstamo es requerido.' });
      }

      const result = await PrestamosController.eliminarPrestamo(idPrestamos);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      console.error('Error en eliminarPrestamo:', error);
      return res.status(500).json({ message: 'Error interno al eliminar el préstamo.' });
    }
  }

  static async ultimoPrestamo (req, res) {
    try {
      const result = await PrestamosController.obtenerUltimoPrestamo();

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ ultimoPrestamo: result.ultimoPrestamo });
    } catch (e) {
      console.error('Error en ultimoPrestamo:', e);
      res.status(500).json({ error: 'Error interno al obtener el último préstamo.' });
    }
  }

  static async obtenerPrestamosPorCedula (req, res) {
    try {
      const { personaCedula } = req.params;

      if (!personaCedula) {
        return res.status(400).json({ message: 'La cédula es requerida.' });
      }

      const result = await PrestamosController.obtenerPrestamosPorCedula(personaCedula);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ prestamos: result.prestamos });
    } catch (error) {
      console.error('Error en obtenerPrestamosPorCedula:', error);
      res.status(500).json({ error: 'Error interno al obtener los préstamos.' });
    }
  }

  static async actualizarPrestamo (req, res) {
    try {
      console.log('Datos recibidos en req.body:', req.body);

      const {
        idPrestamos, monto, plazoMeses, fechaInicio, tasaInteresMoratoria, estadoPrestamo,
        diaPago, IdClientes, clientesPersonaCedula, numeroPrestamo
      } = req.body;

      if (!idPrestamos || !monto || !plazoMeses || !fechaInicio || !tasaInteresMoratoria || !estadoPrestamo || !diaPago || !IdClientes || !clientesPersonaCedula) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      console.log('Datos de préstamo:', { idPrestamos, monto, plazoMeses, fechaInicio, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula });

      const resultado = await PrestamosController.modificarPrestamo(
        idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo,
        diaPago, IdClientes, clientesPersonaCedula
      );

      if (resultado.error) {
        return res.status(500).json({ error: resultado.error });
      }

      return res.status(200).json({ message: resultado.message });
    } catch (e) {
      console.error('Error en actualizarPrestamo:', e);
      return res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
  }
}
