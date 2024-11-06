import UserDAO from "./UserDAO.js"

const userDAO = new UserDAO();
let editIndex = null;  // Variable para saber si estamos en modo edición

document.getElementById("registrationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateForm()) {
        const user = getUserFromForm();
        if (editIndex !== null) {  // Si estamos editando, actualizar el usuario
            userDAO.updateUser(editIndex, user);
            editIndex = null;  // Resetear el índice de edición
            document.querySelector("button[type='submit']").textContent = "Registrar";
        } else {
            userDAO.addUser(user);  // Si no, crear un nuevo usuario
        }
        resetForm();
    }
});

document.getElementById("tipoUsuario").addEventListener("change", () => {
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const extraFields = document.getElementById("extraFields");
    extraFields.innerHTML = "";

    if (tipoUsuario === "docente") {
        extraFields.innerHTML = `
            <div class="form-group">
                <label for="profesion">Profesión:</label>
                <input type="text" id="profesion" name="profesion" required>
            </div>
            <div class="form-group">
                <label for="experiencia">Experiencia:</label>
                <input type="text" id="experiencia" name="experiencia" required>
            </div>
        `;
    } else if (tipoUsuario === "estudiante") {
        extraFields.innerHTML = `
            <div class="form-group">
                <label for="codigo">Código:</label>
                <input type="text" id="codigo" name="codigo" required>
            </div>
            <div class="form-group">
                <label for="programa">Programa:</label>
                <input type="text" id="programa" name="programa" required>
            </div>
        `;
    }
});

// Validación de email y edad
document.getElementById("correo").addEventListener("input", validateEmail);
document.getElementById("fechaNacimiento").addEventListener("input", validateAge);

function validateEmail() {
    const emailInput = document.getElementById("correo");
    const emailError = document.getElementById("emailError");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = "Por favor, ingrese un correo válido.";
        return false;
    } else {
        emailError.textContent = "";
        return true;
    }
}

function validateAge() {
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const ageError = document.getElementById("ageError");

    if (!fechaNacimiento) {
        ageError.textContent = "Este campo es obligatorio.";
        return false;
    }

    const currentDate = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const isValid = birthDate <= new Date(currentDate.setFullYear(currentDate.getFullYear() - 18));

    if (!isValid) {
        ageError.textContent = "Debe ser mayor de edad.";
        return false;
    } else {
        ageError.textContent = "";
        return true;
    }
}

function validateForm() {
    const isEmailValid = validateEmail();
    const isAgeValid = validateAge();
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    
    let isExtraFieldsValid = true;
    if (tipoUsuario === "docente") {
        isExtraFieldsValid = document.getElementById("profesion").value.trim() !== "" &&
                             document.getElementById("experiencia").value.trim() !== "";
    } else if (tipoUsuario === "estudiante") {
        isExtraFieldsValid = document.getElementById("codigo").value.trim() !== "" &&
                             document.getElementById("programa").value.trim() !== "";
    }

    return isEmailValid && isAgeValid && isExtraFieldsValid;
}

function getUserFromForm() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const intereses = Array.from(document.querySelectorAll('input[name="intereses"]:checked')).map(input => input.value);

    let extraData = {};

    if (tipoUsuario === "docente") {
        extraData = {
            profesion: document.getElementById("profesion").value,
            experiencia: document.getElementById("experiencia").value
        };
    } else if (tipoUsuario === "estudiante") {
        extraData = {
            codigo: document.getElementById("codigo").value,
            programa: document.getElementById("programa").value
        };
    }

    return { nombre, apellido, correo, fechaNacimiento, tipoUsuario, intereses, ...extraData };
}

function resetForm() {
    document.getElementById("registrationForm").reset();
    document.getElementById("extraFields").innerHTML = "";
    document.querySelectorAll('input[name="intereses"]').forEach(input => input.checked = false);  // Limpiar los checkboxes
    document.getElementById("emailError").textContent = ""; // Limpiar mensaje de error
    document.getElementById("ageError").textContent = ""; // Limpiar mensaje de error
}

window.editUser = function(index) {
    const user = userDAO.users[index];
    document.getElementById("nombre").value = user.nombre;
    document.getElementById("apellido").value = user.apellido;
    document.getElementById("correo").value = user.correo;
    document.getElementById("fechaNacimiento").value = user.fechaNacimiento;
    document.getElementById("tipoUsuario").value = user.tipoUsuario;

    // Mostrar los campos adicionales correspondientes
    document.getElementById("tipoUsuario").dispatchEvent(new Event("change"));

    // Completar los campos adicionales
    if (user.tipoUsuario === "docente") {
        document.getElementById("profesion").value = user.profesion;
        document.getElementById("experiencia").value = user.experiencia;
    } else if (user.tipoUsuario === "estudiante") {
        document.getElementById("codigo").value = user.codigo;
        document.getElementById("programa").value = user.programa;
    }

    // Seleccionar los intereses del usuario
    document.querySelectorAll('input[name="intereses"]').forEach(input => {
        input.checked = user.intereses.includes(input.value);
    });

    // Cambiar el botón a "Actualizar" y setear editIndex
    document.querySelector("button[type='submit']").textContent = "Actualizar";
    editIndex = index;
};

window.deleteUser = function(index) {
    userDAO.deleteUser(index);
};
