// main.js
import UserDAO from "./UserDAO.js";

// Instancia de UserDAO
const userDAO = new UserDAO();

// Función para manejar el envío del formulario
function handleSubmit(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const intereses = Array.from(document.querySelectorAll('input[name="intereses"]:checked')).map(i => i.value);

    const newUser = { nombre, apellido, correo, fechaNacimiento, tipoUsuario, intereses };

    if (userDAO.editIndex !== null) {
        // Actualizar usuario existente
        userDAO.updateUser(userDAO.editIndex, newUser);
        userDAO.editIndex = null; // Resetear `editIndex` después de la edición
    } else {
        // Agregar nuevo usuario
        userDAO.addUser(newUser);
    }

    document.getElementById("addUserForm").reset();
}

// Evento de envío del formulario
document.getElementById("addUserForm").addEventListener("submit", handleSubmit);

window.editUser = function (index) {
    userDAO.editUser(index);
};

window.deleteUser = function (index) {
    userDAO.deleteUser(index);
};
