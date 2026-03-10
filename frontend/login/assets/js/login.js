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

    if(!user || !password) return alert('Preencha os campos!');
    if(user.length < 3) return alert('Usúario precisa conter mais de 3 caracteres');
    
    try {
        const response = await fetch("https://rifa-online-lfud.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, password })
        });

        const data = await response.json();
        if(!response.ok) return alert(data.message);

        localStorage.setItem('token', data.token);
        window.location.href = 'sorteio.html';
        
    } catch (error) {
        console.log(error)
    }
}
