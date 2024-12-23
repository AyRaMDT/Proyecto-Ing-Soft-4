import { Router } from 'express';
import { ApiAuth } from '../controllers/api-auth.js';
import { authRequire } from '../../middleware/validate-token.js';

export const authRouter = Router();

authRouter.post('/login', ApiAuth.login);
authRouter.post('/logout', ApiAuth.logout);
authRouter.get('/profile', authRequire, ApiAuth.profile);
authRouter.get('/verify', authRequire, ApiAuth.verifyToken);
