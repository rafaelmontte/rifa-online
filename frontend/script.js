let pagina = 1;
const porPagina = 200;
let numerosSelecionados = [];
let vendidos = [];
const precoAtual = document.getElementById("valor");

async function carregarVendidos() {
    const res = await fetch("https://rifa-online-lfud.onrender.com/numeros-vendidos");
    vendidos = await res.json();
}

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

async function confirmarCompra() {
    const nome = document.getElementById("nome").value.trim();
    const contato = document.getElementById("contato").value.trim();

    if (!nome || !contato || numerosSelecionados.length === 0) {
        alert("Preencha o nome, contato e selecione números");
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

        const total = `${numerosSelecionados.length * 5},00`;

        localStorage.setItem("numeros", JSON.stringify(numerosSelecionados));
        localStorage.setItem("total", total);
        localStorage.setItem("nome", nome);
        localStorage.setItem("contato", contato);

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
