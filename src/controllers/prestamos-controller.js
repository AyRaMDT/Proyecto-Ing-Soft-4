import { connectDB } from '../database.js';

const connection = await connectDB();
export class PrestamosController {
  static insertarPrestamo = async ({
    monto,
    plazoMeses,
    fechaInicio,
    numeroPrestamo,
    tasaInteresMoratoria,
    tasaInteresAnual,
    fechaVencimiento,
    diaPago,
    IdClientes,
    clientesPersonaCedula
  }) => {
    try {
      const [result] = await connection.query(
        'CALL agregarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          monto,
          plazoMeses,
          fechaInicio,
          numeroPrestamo,
          tasaInteresMoratoria,
          tasaInteresAnual,
          fechaVencimiento,
          diaPago,
          IdClientes,
          clientesPersonaCedula
        ]
      );

      if (result && result[0] && result[0][0].success === 1) {
        return { success: true, message: result[0][0].message };
      }

      return { success: false, message: 'No se pudo agregar el préstamo. Verifique los datos.' };
    } catch (error) {
      console.error('Error al insertar el préstamo:', error);
      return { success: false, message: 'Error interno al insertar el préstamo.' };
    }
  };

  static async obtenerListaPrestamos (idCliente = null) {
    try {
      const [result] = await connection.query('CALL leerPrestamo(?);', [idCliente]);

      if (!result || result.length === 0) {
        return { success: false, message: 'No se encontraron datos.' };
      }

      const prestamos = result;
      const mensaje = prestamos[0]?.mensaje || 'Consulta realizada correctamente.';

      return { success: true, mensaje, prestamos };
    } catch (error) {
      console.error('Error al obtener los préstamos:', error);
      return { success: false, message: 'Error al ejecutar el SP leerPrestamo.' };
    }
  }

  static async obtenerUltimoPrestamo () {
    try {
      await connection.query('CALL obtenerUltimoPrestamo(@ultimoPrestamo)');

      const [[{ ultimoPrestamo }]] = await connection.query('SELECT @ultimoPrestamo AS ultimoPrestamo');

      if (ultimoPrestamo) {
        return { success: true, ultimoPrestamo };
      } else {
        return { success: false, message: 'No se encontró ningún préstamo registrado.' };
      }
    } catch (error) {
      console.error('Error en obtenerUltimoPrestamo:', error);
      return { success: false, message: 'Error al ejecutar el procedimiento almacenado.' };
    }
  }

  static async obtenerPrestamosPorCedula (personaCedula) {
    try {
      const [prestamos] = await connection.query('CALL obtenerPrestamosPorCedula(?)', [personaCedula]);

      if (prestamos.length > 0) {
        return { success: true, prestamos };
      } else {
        return { success: false, message: 'No se encontraron préstamos para esta cédula.' };
      }
    } catch (error) {
      console.error('Error al obtener préstamos por cédula:', error);
      return { success: false, message: 'Ocurrió un error al obtener los préstamos.' };
    }
  }

  static async modificarPrestamo (
    idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo,
    tasaInteresMoratoria, tasaInteresAnual, estadoPrestamo,
    diaPago, IdClientes, clientesPersonaCedula
  ) {
    try {
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoMeses);
      console.log('Fecha de vencimiento calculada:', fechaVencimiento.toISOString());

      const query = `
            CALL modificarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @mensajeExito);
        `;

      const [result] = await connection.query(query, [
        idPrestamos,
        monto,
        plazoMeses,
        fechaInicio,
        numeroPrestamo,
        tasaInteresMoratoria,
        tasaInteresAnual,
        estadoPrestamo,
        diaPago,
        IdClientes,
        clientesPersonaCedula
      ]);

      const [[{ mensajeExito }]] = await connection.query('SELECT @mensajeExito AS mensajeExito');
      console.log('Resultado del procedimiento almacenado:', result);

      if (mensajeExito.includes('Éxito')) {
        return { message: 'El préstamo se modificó correctamente.' };
      } else {
        console.error(mensajeExito);
        return { error: mensajeExito };
      }
    } catch (e) {
      console.error('Error en modificarPrestamo:', e);
      return { error: 'Ocurrió un error al modificar el préstamo.' };
    }
  }

  static async eliminarPrestamo (idPrestamo) {
    try {
      const [existingLoan] = await connection.query(
        'SELECT idPrestamos FROM prestamoscliente WHERE idPrestamos = ?',
        [idPrestamo]
      );

      if (existingLoan.length === 0) {
        return { success: false, message: 'No se encontró un préstamo con el ID proporcionado.' };
      }

      const [result] = await connection.query('CALL eliminarPrestamo(?)', [idPrestamo]);

      console.log('Resultado de la llamada al procedimiento:', result);

      if (result[1] && result[1][0] && result[1][0].mensajeExito) {
        return { success: true, message: result[1][0].mensajeExito };
      }

      if (result[1] && result[1][0] && result[1][0].mensajeError) {
        return { success: false, message: result[1][0].mensajeError };
      }

      if (result[1] && result[1][0] && result[1][0].mensajeInfo) {
        return { success: false, message: result[1][0].mensajeInfo };
      }

      return { success: false, message: 'Error desconocido.' };
    } catch (error) {
      console.error('Error en eliminarPrestamo:', error);
      return { success: false, message: 'Error al ejecutar el procedimiento almacenado.' };
    }
  }

  static async aprobarPrestamo (idPrestamo) {
    try {
      const query = 'CALL aprobarPrestamo(?)';
      const [result] = await connection.query(query, [idPrestamo]);

      if (result.affectedRows > 0) {
        return { success: true, message: 'El préstamo fue aprobado correctamente.' };
      } else {
        return { success: false, message: 'No se encontró el préstamo con el ID proporcionado.' };
      }
    } catch (error) {
      console.error('Error en aprobarPrestamo:', error);
      return { success: false, message: 'Error al ejecutar el procedimiento almacenado.' };
    }
  }

  static async rechazarPrestamo (idPrestamo) {
    try {
      const query = 'CALL rechazarPrestamo(?)';
      const [result] = await connection.query(query, [idPrestamo]);

      if (result.affectedRows > 0) {
        return { success: true, message: 'El préstamo fue rechazado correctamente.' };
      } else {
        return { success: false, message: 'No se encontró el préstamo con el ID proporcionado.' };
      }
    } catch (error) {
      console.error('Error en rechazarPrestamo:', error);
      return { success: false, message: 'Error al ejecutar el procedimiento almacenado.' };
    }
  }
}

export default PrestamosController;
