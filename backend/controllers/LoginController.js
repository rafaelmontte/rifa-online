const Admin = require('../models/AdminModels');
const bcrypt = require('bcrypt');
const jtw = require('jsonwebtoken');

// ROTA PARA FAZER LOGIN
exports.login = async (req, res) => {
    const { user, password } = req.body;
    console.log(req.body)
    try {
        const admin = await Admin.findOne({ user });
        const passwordIsValid = await bcrypt.compare(password, admin.password);

        // if(!admin || !passwordIsValid) return alert(res.status(401).json({ message: 'Dados Inválidos' }));

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