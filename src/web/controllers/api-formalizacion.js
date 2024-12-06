import { FormalizacionController } from '../../controllers/formalizacion-controller.js';

export class ApiFormalizacion {
  static async agregar (req, res) {
    console.log('Datos recibidos desde el cliente:', req.body); // Depuración
    // eslint-disable-next-line camelcase
    const { analistaIdAnalista, analistaPersonaCedula, prestamoClienteCuota, prestamoscliente_idPrestamos } = req.body;

    // eslint-disable-next-line camelcase
    if (!analistaIdAnalista || !analistaPersonaCedula || !prestamoClienteCuota || !prestamoscliente_idPrestamos) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const result = await FormalizacionController.agregarFormalizacionPrestamo(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json({ message: result.message });
  }

  static async obtenerTodos (req, res) {
    try {
      const result = await FormalizacionController.obtenerFormalizaciones();
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      res.status(200).json({ data: result.data });
    } catch (error) {
      console.error('Error en obtenerTodos:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  static async obtenerPorId (req, res) {
    try {
      const result = await FormalizacionController.obtenerFormalizacionPorId(req.params.id);
      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }
      res.status(200).json({ data: result.data });
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  static async actualizar (req, res) {
    try {
      const result = await FormalizacionController.actualizarFormalizacionPrestamo(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error('Error en actualizar:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  static async eliminar (req, res) {
    try {
      const result = await FormalizacionController.eliminarFormalizacionPrestamo(req.params.id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error('Error en eliminar:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  static async obtenerPrestamosFormalizados (req, res) {
    try {
      const result = await FormalizacionController.obtenerDatosPrestamoFormalizado();
      if (result.success) {
        return res.status(200).json({ success: true, data: result.data });
      } else {
        return res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error en obtenerPrestamosFormalizados:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
  }

  static async rechazarPrestamoFormalizado (req, res) {
    const { prestamoFormalId, estadoRechazadoId } = req.query; // Leer desde la query string
    if (!prestamoFormalId || !estadoRechazadoId) {
      return res.status(400).json({ success: false, message: 'Faltan parámetros obligatorios.' });
    }

    try {
      const result = await FormalizacionController.asignarEliminarPrestamoRechazado(prestamoFormalId, estadoRechazadoId);
      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error en rechazarPrestamoFormalizado:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
  }

  static async modificarPrestamoFormalizado (req, res) {
    // Valida que el cuerpo exista
    if (!req.body) {
      console.error('El cuerpo de la solicitud está vacío.');
      return res.status(400).json({ success: false, message: 'El cuerpo de la solicitud está vacío.' });
    }

    console.log('Cuerpo de la solicitud recibido:', req.body);

    const data = req.body; // Trabaja directamente con el objeto
    const requiredFields = [
      'prestamoFormalId',
      'analistaId',
      'analistaCedula',
      'cuota',
      'monto',
      'plazoMeses',
      'fechaInicio',
      'fechaVencimiento',
      'diaPago',
      'estadoPrestamoId'
    ];

    // Validar que todos los campos estén presentes
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ success: false, message: `El campo ${field} es obligatorio.` });
      }
    }

    try {
      const result = await FormalizacionController.modificarPrestamoFormalizado(data); // Pasa todo el cuerpo
      if (result.success) {
        return res.status(200).json({ success: true, message: result.message });
      } else {
        return res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error en modificarPrestamoFormalizado:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
  }
}
export default ApiFormalizacion;
