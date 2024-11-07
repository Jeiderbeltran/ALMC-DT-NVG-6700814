import UserDAO from "./UserDAO.js";

const userDAO = new UserDAO();
let editIndex = null;  // Variable para saber si estamos en modo edición

// Form submission handler
document.getElementById("registrationForm").addEventListener("submit", handleSubmit);

// Tipo de usuario selection handler
document.getElementById("tipoUsuario").addEventListener("change", updateExtraFields);

// Validación de email y edad
document.getElementById("correo").addEventListener("input", validateEmail);
document.getElementById("fechaNacimiento").addEventListener("input", validateAge);

function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        const user = getUserFromForm();
        if (editIndex !== null) {
            userDAO.updateUser(editIndex, user);
            resetEditMode();
        } else {
            userDAO.addUser(user);
        }
        resetForm();
    }
}

function updateExtraFields() {
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
}

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

    return {
        nombre,
        apellido,
        correo,
        fechaNacimiento,
        tipoUsuario,
        intereses,
        ...extraData
    };
}

function resetForm() {
    document.getElementById("registrationForm").reset();
    document.getElementById("extraFields").innerHTML = "";
    editIndex = null;
}

function resetEditMode() {
    editIndex = null;
    resetForm();
}
