import { PrestamosController } from '../../controllers/prestamos-controller.js';

export class ApiPrestamo {
  static async nuevoPrestamo (req, res) {
    try {
      console.log('req.body en nuevoPrestamo:', req.body);

      const { monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula } = req.body;

      // Verifica si el campo 'clientesPersonaCedula' es un número válido
      if (isNaN(clientesPersonaCedula)) {
        return res.status(400).json({ error: 'El campo clientesPersonaCedula debe ser un número válido.' });
      }

      // Validación de todos los campos
      if (!monto || !plazoMeses || !fechaInicio || !numeroPrestamo || !tasaInteresMoratoria || !estadoPrestamo || !diaPago || !IdClientes || !clientesPersonaCedula) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      // Calcula la fecha de vencimiento (sumar los meses del plazo a la fecha de inicio)
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(plazoMeses));

      // Formatea la fecha de vencimiento a "YYYY-MM-DD" si es necesario
      const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];

      // Llamada al controlador para insertar el préstamo
      const result = await PrestamosController.insertarPrestamo({
        monto,
        plazoMeses,
        fechaInicio,
        fechaVencimiento: fechaVencimientoStr, // Incluye la fecha de vencimiento calculada
        numeroPrestamo,
        tasaInteresMoratoria,
        estadoPrestamo,
        diaPago,
        IdClientes,
        clientesPersonaCedula
      });

      // Validación de resultado
      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      // Respuesta exitosa
      return res.status(201).json({ message: result.message, prestamo: result.prestamo });
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
      const { idPrestamos } = req.query;

      if (!idPrestamos) {
        return res.status(400).json({ message: 'El ID del préstamo es requerido' });
      }

      const result = await PrestamosController.eliminarPrestamo({ idPrestamos });

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error('Error en eliminarPrestamo:', e);
      res.status(500).json({ error: e.message });
    }
  }

  static async modificarPrestamo (req, res) {
    try {
      const { idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula } = req.body;

      if (!idPrestamos || !monto || !plazoMeses || !fechaInicio || !numeroPrestamo || !tasaInteresMoratoria || !estadoPrestamo || !diaPago || !IdClientes || !clientesPersonaCedula) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const result = await PrestamosController.modificarPrestamo({
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
      });

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error('Error en modificarPrestamo:', e);
      res.status(500).json({ error: e.message });
    }
  }
}
