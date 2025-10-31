const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sua_chave_super_secreta_e_forte'; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) return res.status(401).json({ error: "Token não fornecido." }); 

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado." }); 
        }
        req.user = user; 
        next();
    });
}

module.exports = {
    authenticateToken,
    JWT_SECRET
};