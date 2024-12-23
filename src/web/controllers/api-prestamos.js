import { PrestamosController } from '../../controllers/prestamos-controller.js';

export class ApiPrestamo {
  static async nuevoPrestamo (req, res) {
    try {
      console.log('Datos enviados en nuevoPrestamo:', req.body);

      const {
        monto,
        plazoMeses,
        fechaInicio,
        numeroPrestamo,
        tasaInteresMoratoria,
        tasaInteresAnual, // New parameter
        estadoPrestamo,
        diaPago,
        IdClientes,
        clientesPersonaCedula,
        saldo
      } = req.body;

      console.log(diaPago);
      console.log('Valor recibido para clientesPersonaCedula:', clientesPersonaCedula, 'Tipo:', typeof clientesPersonaCedula);

      if (isNaN(clientesPersonaCedula)) {
        return res.status(400).json({ error: 'El campo clientesPersonaCedula debe ser un número válido.' });
      }

      console.log('Valor recibido para clientesPersonaCedula:', clientesPersonaCedula, 'Tipo:', typeof clientesPersonaCedula);

      if (!monto || !plazoMeses || !fechaInicio || !numeroPrestamo || !tasaInteresMoratoria || !tasaInteresAnual || !estadoPrestamo || !diaPago || !IdClientes || !clientesPersonaCedula) {
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
        tasaInteresAnual,
        diaPago,
        IdClientes,
        clientesPersonaCedula,
        saldo: saldo || monto // Asigna monto como valor por defecto para saldo
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
      const idCliente = req.query.idCliente || null;

      const result = await PrestamosController.obtenerListaPrestamos(idCliente);

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

  static async eliminarPrestamo (req, res) {
    try {
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
        idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo,
        tasaInteresMoratoria, tasaInteresAnual, estadoPrestamo,
        diaPago, IdClientes, clientesPersonaCedula
      } = req.body;

      if (!idPrestamos || !monto || !plazoMeses || !fechaInicio ||
            !tasaInteresMoratoria || !tasaInteresAnual || !estadoPrestamo ||
            !diaPago || !IdClientes || !clientesPersonaCedula) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
      }

      console.log('Datos de préstamo:', { idPrestamos, monto, plazoMeses, fechaInicio, tasaInteresMoratoria, tasaInteresAnual, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula });

      const resultado = await PrestamosController.modificarPrestamo(
        idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo,
        tasaInteresMoratoria, tasaInteresAnual, estadoPrestamo,
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

  static async rechazar (req, res) {
    try {
      const { idPrestamo } = req.body;

      if (!idPrestamo) {
        return res.status(400).json({ message: 'El idPrestamo es obligatorio.' });
      }

      const result = await PrestamosController.rechazarPrestamo(idPrestamo);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error('Error en rechazar:', error);
      res.status(500).json({ error: 'Error interno al rechazar el préstamo.' });
    }
  }

  static async aprobar (req, res) {
    try {
      const { idPrestamo } = req.body;

      if (!idPrestamo) {
        return res.status(400).json({ message: 'El idPrestamo es obligatorio.' });
      }

      const result = await PrestamosController.aprobarPrestamo(idPrestamo);

      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }

      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error('Error en aprobar:', error);
      res.status(500).json({ error: 'Error interno al aprobar el préstamo.' });
    }
  }

  static async listaPrestamosPorFecha (req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Las fechas inicio y fin son obligatorias.' });
      }

      const result = await PrestamosController.obtenerPrestamosPorFecha(fechaInicio, fechaFin);

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
    } catch (error) {
      console.error('Error en listaPrestamosPorFecha:', error);
      res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
  }

  static async listaSolicitudesPrestamosPorFecha (req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      // Validar que ambas fechas sean proporcionadas
      if (!fechaInicio || !fechaFin) {
        return res
          .status(400)
          .json({ message: 'Las fechas inicio y fin son obligatorias.' });
      }

      // Llamar al controlador para obtener los datos
      const result = await PrestamosController.obtenerSolicitudesPorFecha(fechaInicio, fechaFin);

      // Validar errores en la consulta
      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }

      // Si no se encontraron resultados
      if (result.solicitudes.length === 0) {
        return res.status(404).json({ message: result.mensaje });
      }

      // Responder con los datos
      res.status(200).json({
        solicitudes: result.solicitudes,
        mensaje: result.mensaje
      });
    } catch (error) {
      console.error('Error en listaSolicitudesPrestamosPorFecha:', error);
      res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
  }

  static async listaPrestamosporID (req, res) {
    try {
      // Obtener el parámetro `idCliente` de la consulta (query string)
      const idCliente = req.query.idCliente || null;

      // Llamar al controlador para obtener los préstamos
      const result = await PrestamosController.obtenerListaPrestamos(idCliente);

      if (!result.success) {
        return res.status(500).json({ message: result.message });
      }

      if (result.prestamos.length === 0) {
        return res.status(404).json({ message: result.mensaje });
      }

      // Responder con éxito
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
