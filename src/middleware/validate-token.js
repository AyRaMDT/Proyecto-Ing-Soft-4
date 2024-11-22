import jwt from 'jsonwebtoken';

// esta funcion se ocupará para las rutas protegidas
// (si no inicia sesión no podrá acceder al sistema)
export const authRequire = (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies);

  if (!token) {
    return res.status(401).json({ message: 'Autorizacion denegada' });
  }

  // req.user = jwt.verify(token, TOKEN_SECRET);
  // next();

  jwt.verify(token, 'secretpassword', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token expired or invalid' });
    }
    req.analista = decoded;
    next();
  });
};
