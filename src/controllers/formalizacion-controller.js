import { connectDB } from '../database.js';

const connection = await connectDB(); // Conexión inicial

export class FormalizacionController {
  static async agregarFormalizacionPrestamo (data) {
    try {
      console.log('Datos recibidos en el controlador:', data);

      const query = 'CALL agregarFormalizacionPrestamo(?, ?, ?, ?)';
      console.log('Datos enviados al procedimiento almacenado:', [
        data.analistaIdAnalista,
        data.analistaPersonaCedula,
        data.prestamoClienteCuota,
        data.prestamoscliente_idPrestamos
      ]);

      const [result] = await connection.query(query, [
        data.analistaIdAnalista,
        data.analistaPersonaCedula,
        data.prestamoClienteCuota,
        data.prestamoscliente_idPrestamos
      ]);

      console.log('Resultado del procedimiento almacenado:', result);

      return { success: true, message: 'Formalización agregada correctamente.' };
    } catch (error) {
      console.error('Error en agregarFormalizacionPrestamo:', error);
      return { success: false, message: 'Error al agregar la formalización.' };
    }
  }

  static async obtenerFormalizaciones () {
    try {
      const query = 'CALL obtenerFormalizaciones()';
      const [result] = await connection.query(query);
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('Error en obtenerFormalizaciones:', error);
      return { success: false, message: 'Error al obtener las formalizaciones.' };
    }
  }

  static async obtenerFormalizacionPorId (id) {
    try {
      const query = 'CALL obtenerFormalizacionPorId(?)';
      const [result] = await connection.query(query, [id]);
      if (result[0].length === 0) {
        return { success: false, message: 'Formalización no encontrada.' };
      }
      return { success: true, data: result[0][0] };
    } catch (error) {
      console.error('Error en obtenerFormalizacionPorId:', error);
      return { success: false, message: 'Error al obtener la formalización.' };
    }
  }

  static async actualizarFormalizacionPrestamo (data) {
    try {
      console.log('Datos recibidos en el controlador para actualizar:', data);

      const query = 'CALL actualizarFormalizacionPrestamo(?, ?, ?, ?, ?)';
      console.log('Datos enviados al procedimiento almacenado para actualizar:', [
        data.idPrestamoFormal,
        data.analistaIdAnalista,
        data.analistaPersonaCedula,
        data.prestamoClienteCuota,
        data.prestamoscliente_idPrestamos
      ]);

      await connection.query(query, [
        data.idPrestamoFormal,
        data.analistaIdAnalista,
        data.analistaPersonaCedula,
        data.prestamoClienteCuota,
        data.prestamoscliente_idPrestamos
      ]);

      console.log('Formalización actualizada correctamente.');

      return { success: true, message: 'Formalización actualizada correctamente.' };
    } catch (error) {
      console.error('Error en actualizarFormalizacionPrestamo:', error);
      return { success: false, message: 'Error al actualizar la formalización.' };
    }
  }

  static async eliminarFormalizacionPrestamo (id) {
    try {
      const query = 'CALL eliminarFormalizacionPrestamo(?)';
      await connection.query(query, [id]);
      return { success: true, message: 'Formalización eliminada correctamente.' };
    } catch (error) {
      console.error('Error en eliminarFormalizacionPrestamo:', error);
      return { success: false, message: 'Error al eliminar la formalización.' };
    }
  }
}
