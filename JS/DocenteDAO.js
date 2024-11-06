import UserDAO from "./UserDAO.js";

export default class DocenteDAO extends UserDAO {
    addUser(user) {
        if (!user.profesion || !user.experiencia) {
            throw new Error("Profesión y experiencia son requeridos para un docente.");
        }
        super.addUser(user);
    }

    // Otros métodos específicos para docentes (si es necesario)
}
