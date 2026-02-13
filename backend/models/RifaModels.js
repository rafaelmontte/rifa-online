const mongoose = require("mongoose");

const RifaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    contato: {
        type: String,
        required: true
    },
    numeros: {
        type: [Number],
        validate: {
            validator: v => new Set(v).size === v.length,
            message: "Números duplicados não são permitidos"
        }
    },
    data: {
        type: Date,
        default: () =>
            new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: "America/Sao_Paulo"
                })
            )
    },
    status: {
        type: String,
        default: "Aguardando Pagamento"
    }
});

RifaSchema.index({ nome: 1 });

module.exports = mongoose.model("Rifa", RifaSchema);
