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

  static async obtenerDatosPrestamoFormalizado () {
    try {
      const query = 'CALL ObtenerDatosPrestamoFormalizado()'; // Llama al procedimiento almacenado
      const [rows] = await connection.query(query); // Ejecuta el query
      return { success: true, data: rows[0] }; // Retorna la primera parte de los resultados
    } catch (error) {
      console.error('Error en obtenerDatosPrestamoFormalizado:', error);
      return { success: false, message: 'Error al obtener los datos de préstamos formalizados.' };
    }
  }

  static async asignarEliminarPrestamoRechazado (prestamoFormalId, estadoRechazadoId) {
    try {
      const query = 'CALL AsignarEliminarPrestamoRechazado(?, ?)';
      const [result] = await connection.query(query, [prestamoFormalId, estadoRechazadoId]); // Ejecuta el procedimiento
      console.log(result);
      return { success: true, message: 'Préstamo formalizado eliminado y estado actualizado.' };
    } catch (error) {
      console.error('Error en asignarEliminarPrestamoRechazado:', error);
      return { success: false, message: 'Error al procesar el préstamo formalizado.' };
    }
  }

  static async modificarPrestamoFormalizado (data) {
    try {
      const {
        prestamoFormalId,
        analistaId,
        analistaCedula,
        cuota,
        monto,
        plazoMeses,
        fechaInicio,
        fechaVencimiento,
        diaPago,
        estadoPrestamoId
      } = data; // Aquí desestructuramos desde el objeto recibido directamente

      const query = 'CALL ModificarPrestamoFormalizado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const params = [
        prestamoFormalId,
        analistaId,
        analistaCedula,
        cuota,
        monto,
        plazoMeses,
        fechaInicio,
        fechaVencimiento,
        diaPago,
        estadoPrestamoId
      ];

      await connection.query(query, params);
      return { success: true, message: 'Préstamo formalizado actualizado correctamente.' };
    } catch (error) {
      console.error('Error en modificarPrestamoFormalizado:', error);
      return { success: false, message: 'Error al modificar el préstamo formalizado.' };
    }
  }
}
