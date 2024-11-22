import { AuthController } from '../../controllers/auth-controller.js';
import { createAccessToken } from '../../utils/jwt.js';

export class ApiAuth {
  static async register (req, res) {
    try {
      // console.log(req.body);

      const { cedula, nombre, primerApellido, segundoApellido, telefono, correoElectronico, contrasena } = req.body;

      const createPersonaResult = await AuthController.registarPersona({ cedula, nombre, primerApellido, segundoApellido });

      if (!createPersonaResult.success) {
        return res.status(400).json({ errors: createPersonaResult.errors });
      }

      const createAnalistaResult = await AuthController.registarAnalista({ telefono, correoElectronico, contrasena, cedula });

      if (!createAnalistaResult.success) {
        return res.status(400).json({ errors: createAnalistaResult.errors });
      }

      const token = await createAccessToken({ idanalistaCredito: createAnalistaResult.analista.idanalistaCredito });

      // cookie con el usuario permitido para acceder a las rutas protegidas
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });

      return res.status(201).json({ message: createAnalistaResult.message, analista: createAnalistaResult.analista });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async login (req, res) {
    const { contrasena, personaCedula } = req.body;

    try {
      const loginResult = await AuthController.iniciarSesion({ personaCedula, contrasena });

      if (!loginResult.success) {
        return res.status(400).json({ message: loginResult.message });
      }

      const token = await createAccessToken({ idanalistaCredito: loginResult.analista.idanalistaCredito });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });

      return res.status(201).json({ message: loginResult.message, analista: loginResult.analista });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async logout (req, res) {
    res.cookie('token', '', {
      expires: new Date(0)
    });

    return res.status(200).end();
  }

  static async profile (req, res) {
    console.log(req.analista);
    const { idanalistaCredito } = req.analista;
    const profileData = await AuthController.profile({ idanalistaCredito });

    console.log(profileData);

    if (!profileData.analista) {
      return res.status(400).json({ message: 'analista no encontrado' });
    }

    res.status(200).json({ analista: profileData.analista });
  }
}
