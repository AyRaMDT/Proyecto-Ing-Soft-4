import { LoginController } from '../../controllers/login-controller.js';

export class ApiLogin {
  static async autenticar (req, res) {
    try {
      const { idUsuario, contrasena } = req.body;

      if (!idUsuario || !contrasena) {
        return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
      }

      const result = await LoginController.autenticarUsuario({ idUsuario, contrasena });

      if (result.success) {
        return res.status(200).json({
          mensaje: 'Inicio de sesión exitoso',
          rol: result.usuario.rol
        });
      }

      return res.status(401).json({ mensaje: result.message });
    } catch (error) {
      console.error('Error en la autenticación:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
}
