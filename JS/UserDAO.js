import CookieManager from "./CookieManager.js";

export default class UserDAO {
    constructor() {
        // Cargar usuarios desde las cookies al inicializar
        this.users = JSON.parse(CookieManager.getCookie("users")) || [];
        this.editIndex = null; // Para almacenar el índice del usuario en edición
        this.loadFormData(); // Cargar datos del formulario si están en la cookie
        this.displayUsers();
    }

    // Agregar o actualizar un usuario
    addUser(user) {
        if (this.editIndex !== null) {  // Si `editIndex` tiene un valor, estamos en modo de edición
            this.updateUser(this.editIndex, user);
            this.editIndex = null; // Restablecemos `editIndex` después de la actualización
        } else {
            // De lo contrario, agregamos un nuevo usuario
            this.users.push(user);
        }
        this.clearFormData(); // Limpiar los datos temporales del formulario después de guardar
        this.updateCookie();
        this.displayUsers();
        this.clearForm(); // Limpiar el formulario para prepararlo para el próximo registro
    }

    // Actualizar los datos de un usuario
    updateUser(index, updatedUser) {
        this.users[index] = updatedUser; // Actualiza el usuario en la lista
        this.updateCookie();
        this.displayUsers();
    }

    // Eliminar un usuario con confirmación
    deleteUser(index) {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            this.users.splice(index, 1);
            this.updateCookie();
            this.displayUsers();
        }
    }

    // Guardar los usuarios en las cookies con una expiración de 60 segundos
    updateCookie() {
        CookieManager.setCookie("users", JSON.stringify(this.users), 60);
    }

    // Guardar los datos del formulario temporalmente en la cookie
    saveFormData() {
        const formData = {
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            correo: document.getElementById("correo").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            tipoUsuario: document.getElementById("tipoUsuario").value,
            intereses: Array.from(document.querySelectorAll("input[name='intereses']:checked")).map(checkbox => checkbox.value)
        };
        CookieManager.setCookie("formData", JSON.stringify(formData), 60);
    }

    // Cargar los datos del formulario desde la cookie
    loadFormData() {
        const formData = JSON.parse(CookieManager.getCookie("formData"));
        if (formData) {
            document.getElementById("nombre").value = formData.nombre || "";
            document.getElementById("apellido").value = formData.apellido || "";
            document.getElementById("correo").value = formData.correo || "";
            document.getElementById("fechaNacimiento").value = formData.fechaNacimiento || "";
            document.getElementById("tipoUsuario").value = formData.tipoUsuario || "";

            const checkboxes = document.querySelectorAll("input[name='intereses']");
            checkboxes.forEach(checkbox => {
                checkbox.checked = formData.intereses.includes(checkbox.value);
            });
        }
    }

    // Limpiar los datos del formulario de la cookie
    clearFormData() {
        CookieManager.deleteCookie("formData");
    }

    // Limpiar el formulario para un nuevo registro
    clearForm() {
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("correo").value = "";
        document.getElementById("fechaNacimiento").value = "";
        document.getElementById("tipoUsuario").value = "";
        
        // Desmarcar todas las checkboxes de intereses
        const checkboxes = document.querySelectorAll("input[name='intereses']");
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    // Mostrar los usuarios en la tabla
    displayUsers() {
        const tbody = document.querySelector("#userTable tbody");
        tbody.innerHTML = "";  // Limpiar la tabla antes de agregar nuevos usuarios

        // Recorrer la lista de usuarios y agregar filas a la tabla
        this.users.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = 
                `<td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.correo}</td>
                <td>${user.fechaNacimiento}</td>
                <td>${user.tipoUsuario}</td>
                <td>${user.intereses.join(", ")}</td>
                <td>
                    <button class="editButton" data-index="${index}">Editar</button>
                    <button class="deleteButton" data-index="${index}">Eliminar</button>
                </td>`;
            tbody.appendChild(tr);
        });

        // Asociar los eventos de editar y eliminar a los botones
        this.addEventListeners();
    }

    // Añadir los manejadores de eventos para los botones de editar y eliminar
    addEventListeners() {
        const editButtons = document.querySelectorAll(".editButton");
        const deleteButtons = document.querySelectorAll(".deleteButton");

        editButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.dataset.index;
                this.editUser(index);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const index = event.target.dataset.index;
                this.deleteUser(index);
            });
        });

        // Guardar los datos del formulario temporalmente al cambiar
        const formInputs = document.querySelectorAll("#nombre, #apellido, #correo, #fechaNacimiento, #tipoUsuario, input[name='intereses']");
        formInputs.forEach(input => {
            input.addEventListener("change", () => this.saveFormData());
        });
    }

    // Método para editar un usuario
    editUser(index) {
        const user = this.users[index];

        // Llenamos el formulario con los datos del usuario seleccionado
        document.getElementById("nombre").value = user.nombre;
        document.getElementById("apellido").value = user.apellido;
        document.getElementById("correo").value = user.correo;
        document.getElementById("fechaNacimiento").value = user.fechaNacimiento;
        document.getElementById("tipoUsuario").value = user.tipoUsuario;

        // Llenar los checkboxes de intereses
        const checkboxes = document.querySelectorAll("input[name='intereses']");
        checkboxes.forEach(checkbox => {
            checkbox.checked = user.intereses.includes(checkbox.value);
        });

        // Guardamos el índice del usuario que se está editando
        this.editIndex = index;
    }
}
