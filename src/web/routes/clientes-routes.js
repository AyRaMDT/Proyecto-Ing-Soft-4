import { Router } from 'express';
import { ApiCliente } from '../controllers/api-clientes.js';  

export const clienteRouter = Router();

clienteRouter.post('/crear-cliente', ApiCliente.nuevoCliente);


clienteRouter.get('/obtener-clientes', ApiCliente.listaClientes);


clienteRouter.delete('/eliminar-cliente', ApiCliente.eliminarCliente);


clienteRouter.put('/modificar-cliente', ApiCliente.modificarCliente);
