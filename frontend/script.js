let pagina = 1;
const porPagina = 200;
let numerosSelecionados = [];
let vendidos = [];
const precoAtual = document.getElementById("valor");

async function carregarVendidos() {
    const res = await fetch("https://rifa-online-lfud.onrender.com/numeros-vendidos");
    vendidos = await res.json();
}

const tabela = document.getElementById("tabela");
const h1 = document.createElement("h1")
const div = document.createElement("div")
h1.innerText = "EM MANUTENÇÃO"

div.appendChild(h1);
tabela.appendChild(div);

async function carregarNumeros() {
    await carregarVendidos();

    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    const inicio = (pagina - 1) * porPagina + 1;
    const fim = inicio + porPagina - 1;

    for (let i = inicio; i <= fim; i++) {
        const div = document.createElement("div");

        div.textContent = i;
        div.classList.add("numero");

        if (vendidos.includes(i)) {
            div.classList.add("vendido");
        } else if (numerosSelecionados.includes(i)) {
            div.classList.add("selecionado");
        }

        precoAtual.textContent = `R$${numerosSelecionados.length * 5},00`;

        div.onclick = () =>
            selecionarNumero(i);
        tabela.appendChild(div);
    }

    document.getElementById("paginaAtual").textContent = pagina;
}


function selecionarNumero(n) {
    if (vendidos.includes(n)) return;

    if (numerosSelecionados.includes(n)) {
        numerosSelecionados = numerosSelecionados.filter(x => x !== n);
    } else {
        numerosSelecionados.push(n);
    }
    carregarNumeros();
}

function proximaPagina() {
    if (pagina < 2) {
        pagina++;
        carregarNumeros();
    }
}

function paginaAnterior() {
    if (pagina > 1) {
        pagina--;
        carregarNumeros();
    }
}

function limparContato(contato) {
    return contato.replace(/\D/g, "");
}

/* CRIA UM MODAL PARA ALERTAS */
function modalAlert(message) {
    const section = document.querySelector(".container-modal");
    section.style.display = "flex"
    const alertText = document.querySelector(".message");
    alertText.innerText = message;

    if (section) {
        document.body.classList.add('no-scroll')
        closeModal();
    }
}

/* FECHAR MODAL DE ALERTAS */
function closeModal() {
    const section = document.querySelector(".container-modal");
    const closeModal = document.querySelector(".close-modal");

    section.addEventListener("click", () => {
        section.style.display = "none";
        document.body.classList.remove('no-scroll')
    });

    closeModal.addEventListener("click", () => {
        section.style.display = "none";
        document.body.classList.remove('no-scroll')
    });
}

function validaCampos(nome, contato) {
    if (!nome) {
        modalAlert("Você deve infomar seu nome");
        return false;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        modalAlert("Você deve infomar seu nome");
        return false;
    }

    if (nome.length < 3) {
        modalAlert("Nome deve conter 3 ou mais caracteres");
        return false;
    }

    if (!/^\d{10,11}$/.test(contato) || !contato) {
        modalAlert("Infome um contato válido (DDD + número)");
        return false;
    }

    if (numerosSelecionados.length === 0) {
        modalAlert("Escolha um número");
        return false;
    }

    return true;
}

async function confirmarCompra() {
    const nome = document.getElementById("nome").value.trim();
    let contato = document.getElementById("contato").value.trim();
    contato = limparContato(contato);

    if (!validaCampos(nome, contato)) {
        return;
    }

    try {
        // SALVAR COMPRA
        await fetch("https://rifa-online-lfud.onrender.com/comprar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, contato, numeros: numerosSelecionados })
        });

        // SALVAR DADOS PARA PAGAMENTO
        const total = `R$${numerosSelecionados.length * 5},00`;

        localStorage.setItem("Numeros", JSON.stringify(numerosSelecionados));
        localStorage.setItem("Total", total);
        localStorage.setItem("Nome", nome);
        localStorage.setItem("Contato", contato);

        // LIMPAR E IR PARA PAGAMENTO
        numerosSelecionados = [];
        carregarNumeros();
        window.location.href = "pagamento.html";

    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor");
    }
}

carregarNumeros();
