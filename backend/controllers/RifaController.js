const Rifa = require('../models/RifaModels');

// ROTA PARA COMPRAR NúMEROS
exports.comprarNumeros = async (req, res) => {
    try {
        const { nome, contato, numeros } = req.body;

        if (numeros.length === 0) {
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
}

// ROTA PARA BUSCAR NÚMEROS VENDIDOS
exports.numerosVendidos = async (req, res) => {
    try {
        // BUSCANDO OS DADOS DO BANCO
        const compras = await Rifa.find();

        // PEGANDO OS NUMEROS VENDIDOS DO BANCO
        const vendidos = compras.flatMap(c => c.numeros);
        res.json(vendidos);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar números" })
    }
}

