import jwt from 'jsonwebtoken';

export function createAccessToken (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      'secretpassword',
      { expiresIn: '2h' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
