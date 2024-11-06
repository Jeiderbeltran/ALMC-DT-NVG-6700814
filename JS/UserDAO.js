export default class UserDAO {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
        this.displayUsers();
    }

    updateUser(index, updatedUser) {
        this.users[index] = updatedUser;
        this.displayUsers();
    }

    deleteUser(index) {
        this.users.splice(index, 1);
        this.displayUsers();
    }

    displayUsers() {
        const tbody = document.querySelector("#userTable tbody");
        tbody.innerHTML = "";
        this.users.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.correo}</td>
                <td>${user.fechaNacimiento}</td>
                <td>${user.tipoUsuario}</td>
                <td>${user.intereses.join(", ")}</td>
                <td>
                    <button onclick="editUser(${index})">Editar</button>
                    <button onclick="deleteUser(${index})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}
