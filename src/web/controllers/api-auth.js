import { AuthController } from '../../controllers/auth-controller.js';
export class ApiAuth {
  static async login (req, res) {
    try {
      const { personaCedula, contrasena } = req.body;

      if (!personaCedula || !contrasena) {
        return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
      }

      const result = await AuthController.iniciarSesion({ personaCedula, contrasena });

      if (!result.success) {
        return res.status(401).json({ mensaje: result.message });
      }

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000
      });

      return res.status(200).json({ mensaje: result.message, rol: result.rol });
    } catch (error) {
      console.error('Error en la autenticación:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  static async profile (req, res) {
    try {
      const { id, rol } = req.user;

      const result = await AuthController.perfil({ id, rol });

      if (!result.success) {
        return res.status(404).json({ mensaje: result.message });
      }

      return res.status(200).json({ perfil: result.perfil });
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }

  static logout (req, res) {
    res.clearCookie('token');
    return res.status(200).json({ mensaje: 'Logout exitoso' });
  }
}
