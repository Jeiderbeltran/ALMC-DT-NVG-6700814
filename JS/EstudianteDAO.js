import UserDAO from "./UserDAO.js";

export default class EstudianteDAO extends UserDAO {
    addUser(user) {
        if (!user.codigo || !user.programa) {
            throw new Error("Código y programa son requeridos para un estudiante.");
        }
        super.addUser(user);
    }

    // Otros métodos específicos para estudiantes (si es necesario)
}
