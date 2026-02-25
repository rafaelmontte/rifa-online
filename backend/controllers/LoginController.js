const Admin = require('../models/Admin');

// ROTA PARA CRIAR LOGIN
exports.login = async (req, res) => {
    try {
        const { user, password } = req.body;

        const admin = await Admin.create({ user: user, password: password, role: 'admin' });

        res.json({ sucesso: true, admin });

    } catch (error) {
        res.status(500).json({ error: "Erro ao criar Admin" })
    }
}