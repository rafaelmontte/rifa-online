const Admin = require('../models/AdminModels');
const bcrypt = require('bcrypt');
const jtw = require('jsonwebtoken');

// ROTA PARA CRIAR LOGIN
exports.login = async (req, res) => {
    const { user, password } = req.body;
    try {
        const admin = await Admin.findOne({ user });
        if (!admin) return res.status(401).json({ message: 'Usúario inválido' });

        const passwordIsValid = await bcrypt.compare(password, admin.password);
        if (!passwordIsValid) return res.status(401).json({ message: 'Senha inválida' });

        const token = jtw.sign(
            { id: admin._id, role: admin.role },
            'SEGREDO_SUPER_SECRETO',
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
};