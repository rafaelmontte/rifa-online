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

/* COMPRAR (AGRUPADO POR NOME) */
app.post("/comprar", async (req, res) => {
    try {
        const { nome, contato, numeros } = req.body;

        if (!nome || !contato || !numeros || numeros.length === 0) {
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

        const compra = await Rifa.findOneAndUpdate(
            { nome: nome.trim() },
            {
                $addToSet: { numeros: { $each: numeros } },
                $set: {
                    contato,
                    data: new Date(
                        new Date().toLocaleString("pt-BR", {
                            timeZone: "America/Sao_Paulo"
                        })
                    )
                }
            },
            { new: true, upsert: true }
        );

        res.json({ sucesso: true, compra });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro no servidor" });
    }
});


app.listen(3000, () =>
    console.log("Servidor rodando na porta 3000")
);
