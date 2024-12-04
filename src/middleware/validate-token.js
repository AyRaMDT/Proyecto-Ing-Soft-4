import jwt from 'jsonwebtoken';

const TOKEN_SECRET = 'secretpassword';

export const authRequire = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ mensaje: 'No autorizado' });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }

    req.user = decoded;
    next();
  });
};
