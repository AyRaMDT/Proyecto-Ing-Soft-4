import { connectDB } from '../database.js';

const connection = await connectDB();
export class PrestamosController {
  static insertarPrestamo = async ({
    monto,
    plazoMeses,
    fechaInicio,
    numeroPrestamo,
    tasaInteresMoratoria,
    fechaVencimiento,
    diaPago,
    IdClientes,
    clientesPersonaCedula
  }) => {
    try {
      const [result] = await connection.query(
        'CALL agregarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          monto,
          plazoMeses,
          fechaInicio,
          numeroPrestamo,
          tasaInteresMoratoria,
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

  static async obtenerListaPrestamos () {
    try {
      const query = 'SELECT * FROM prestamoscliente';
      const [rows] = await connection.query(query); // Asegúrate de que `rows` es un arreglo.
      return rows; // Devolver como un arreglo
    } catch (error) {
      console.error('Error al obtener los préstamos:', error);
      throw error;
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

  static async modificarPrestamo (idPrestamos, monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula) {
    try {
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoMeses);
      console.log('Fecha de vencimiento calculada:', fechaVencimiento.toISOString());

      // Obtener los datos originales de los préstamos
      const datosOriginales = await PrestamosController.obtenerListaPrestamos();

      // Asegurarse de que datosOriginales es un arreglo
      if (!Array.isArray(datosOriginales)) {
        console.error('Error: Los datos originales no son un arreglo.');
        return { error: 'Error al obtener los datos originales del préstamo.' };
      }

      const datosModificados = [
        monto, plazoMeses, fechaInicio, numeroPrestamo, tasaInteresMoratoria, estadoPrestamo, diaPago, IdClientes, clientesPersonaCedula
      ];

      // Comparación de los datos originales y modificados
      const hayCambios = datosOriginales.some((dato, index) => {
        return dato !== datosModificados[index];
      });

      if (!hayCambios) {
        console.warn('No hubo cambios en los datos del préstamo.');
        return { error: 'No hubo cambios en los datos del préstamo.' };
      }

      const query = `
      CALL modificarPrestamo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @mensajeExito);
    `;

      const [result] = await connection.query(query, [
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
      ]);

      // Obtener el mensaje de salida
      const [[{ mensajeExito }]] = await connection.query('SELECT @mensajeExito AS mensajeExito');
      console.log('Resultado del procedimiento almacenado:', result);

      // Manejo del mensaje de salida
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
}

export default PrestamosController;
