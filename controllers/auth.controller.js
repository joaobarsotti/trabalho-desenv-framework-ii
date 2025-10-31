const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth.middleware'); 
const User = db.User;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password); 

        if (passwordMatch) { 
            const token = jwt.sign(
                { id: user.id, email: user.email, name: user.name }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            ); 

            return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};