import { ClienteController } from '../../controllers/clientes-controller.js';

export class ApiCliente {


  static async nuevoCliente(req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const { direccion, telefono, correoElectronico, Persona_Cedula, contrasena } = req.body;
  
      const result = await ClienteController.insertarCliente({ direccion, telefono, correoElectronico, Persona_Cedula, contrasena });
      res.status(201).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
  


  static async listaClientes(req, res) {
    try {
      const result = await ClienteController.obtenerListaClientes();

      if (!result.success) {
       
        return res.status(404).json({ message: result.message });
      }


      res.status(200).json({ clientes: result.clientes });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }


  static async eliminarCliente(req, res) {
    try {
      const { Persona_Cedula } = req.query;

      const result = await ClienteController.eliminarCliente({ Persona_Cedula });

      if (!result.success) {
      
        return res.status(404).json({ message: result.message });
      }

    
      res.status(200).json({ message: result.message });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }


static async modificarCliente(req, res) {
    try {
      const { idClientes, direccion, telefono, correoElectronico, Persona_Cedula, contrasena } = req.body;
  
      
      if (!direccion || !telefono || !correoElectronico || !Persona_Cedula || !contrasena) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
      }
  
      const result = await ClienteController.modificarCliente({
        idClientes,
        direccion,
        telefono,
        correoElectronico,
        Persona_Cedula,
        contrasena
      });
  
     
      if (!result.success) {
        return res.status(404).json({ message: result.message });
      }
  
    
      res.status(200).json({ message: result.message });
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
  
}
