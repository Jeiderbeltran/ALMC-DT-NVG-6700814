// main.js
import UserDAO from "./UserDAO.js";

// Instancia de UserDAO
const userDAO = new UserDAO();

document.getElementById("addUserForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const intereses = Array.from(document.querySelectorAll('input[name="intereses"]:checked')).map(i => i.value);

    const newUser = { nombre, apellido, correo, fechaNacimiento, tipoUsuario, intereses };
    userDAO.addUser(newUser);

    document.getElementById("addUserForm").reset();
});

window.editUser = function (index) {
    const user = userDAO.users[index];
    document.getElementById("nombre").value = user.nombre;
    document.getElementById("apellido").value = user.apellido;
    document.getElementById("correo").value = user.correo;
    document.getElementById("fechaNacimiento").value = user.fechaNacimiento;
    document.getElementById("tipoUsuario").value = user.tipoUsuario;

    document.getElementById("addUserForm").onsubmit = function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("correo").value;
        const fechaNacimiento = document.getElementById("fechaNacimiento").value;
        const tipoUsuario = document.getElementById("tipoUsuario").value;
        const intereses = Array.from(document.querySelectorAll('input[name="intereses"]:checked')).map(i => i.value);

        const updatedUser = { nombre, apellido, correo, fechaNacimiento, tipoUsuario, intereses };
        userDAO.updateUser(index, updatedUser);

        document.getElementById("addUserForm").reset();
        document.getElementById("addUserForm").onsubmit = addUserEventHandler;
    };
};

window.deleteUser = function (index) {
    userDAO.deleteUser(index);
};
