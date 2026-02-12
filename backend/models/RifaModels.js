const mongoose = require("mongoose");

const RifaSchema = new mongoose.Schema({
    Nome: {
        type: String,
        required: true
    },
    Contato: {
        type: String,
        required: true
    },
    Numeros: {
        type: [Number],
        validate: {
            validator: v => new Set(v).size === v.length,
            message: "Números duplicados não são permitidos"
        }
    },
    Status: {
        type: String,
        default: "Aguardando Pagamento"
    },
    Data: {
        type: Date,
        default: () =>
            new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: "America/Sao_Paulo"
                })
            )
    }
});

RifaSchema.index({ nome: 1 });

module.exports = mongoose.model("Rifa", RifaSchema);
