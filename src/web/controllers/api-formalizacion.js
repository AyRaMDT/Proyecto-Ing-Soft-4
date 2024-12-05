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
}

export default ApiFormalizacion;
