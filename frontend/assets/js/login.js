// MOSTRAR SENHA OU OCULTAR
const form = document.getElementById("form");

const inputPassword = document.getElementById("password");
const button = document.getElementById("submit");

function eyePassword() {
    const img = document.querySelector(".ver-password");

    if (inputPassword.type === "password") {
        inputPassword.type = "text"
        img.src = "./assets/img/eye-off-outline.svg"

    } else {
        inputPassword.type = "password"
        img.src = "./assets/img/eye-outline.svg"
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    login();
})

async function login() {
    const user = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
        const response = await fetch("https://rifa-online-lfud.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, password })
        });

        const data = await response.json();
        console.log(response)

    } catch (error) {
        console.log(error)
    }
}
