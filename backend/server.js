require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Rifa = require("./models/RifaModels");

const app = express();
app.use(cors());
app.use(express.json());

/* CONEXÃO COM O BANCO */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err));

/* BUSCAR NÚMEROS VENDIDOS */
app.get("/numeros-vendidos", async (req, res) => {
    const compras = await Rifa.find();
    const vendidos = compras.flatMap(c => c.numeros);
    res.json(vendidos);
});

function validaDados(nome, contato) {
    if (!nome || nome.trim().length < 3) {
        return "Nome inválido";
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        return "Nome deve conter apenas letras";
    }

    if (!/^\d{10,11}$/.test(contato)) {
        return "Contato inválido";
    }

    return null;
}

/* COMPRAR (AGRUPADO POR NOME) */
app.post("/comprar", async (req, res) => {
    try {
        const { nome, contato, numeros } = req.body;
        const erro = validaDados(nome, contato);

        if (erro || numeros.length === 0) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }

        const jaVendidos = await Rifa.findOne({
            numeros: { $in: numeros }
        });

        if (jaVendidos) {
            return res.status(400).json({
                erro: "Um ou mais números já foram vendidos"
            });
        }

        const compra = await Rifa.create({
            nome: nome.trim(),
            contato: contato,
            numeros: numeros,
            status: "Aguardando Pagamento"
        });

        res.json({ sucesso: true, compra });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

app.listen(3000, () =>
    console.log("Servidor rodando na porta 3000")
);
