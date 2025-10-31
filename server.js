const userRoutes = require('./routes/user.routes');
const express = require("express");
const cors = require('cors'); 
const { Sequelize, DataTypes, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth.routes'); 
const equipmentRoutes = require('./routes/equipment.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const { authenticateToken, JWT_SECRET } = require('./middleware/auth.middleware');

const db = require('./models'); 
const sequelize = db.sequelize;
const { User, Equipment, Maintenance } = db;

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json());

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/users', userRoutes);


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        
        await sequelize.sync({ alter: true }); 
        console.log('Tabelas sincronizadas.');

        const [adminUser, created] = await User.findOrCreate({
            where: { email: 'admin@faculdadetech.com' },
            defaults: { 
                name: 'Administrador', 
                password: 'senha123'
            }
        });

        if (!created) {
            await adminUser.update({ password: 'senha123' }); 
            console.log('Senha do Administrador resetada e criptografada (via hook).');
        }

        await Equipment.findOrCreate({
             where: { serialNumber: 'PRJ-E-001' },
             defaults: { name: "Projetor Epson", category: "Audiovisual", serialNumber: "PRJ-E-001", status: "disponível" }
        });
        
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Email: admin@faculdadetech.com | Senha: senha123`);
        });

    } catch (error) {
        console.error('Erro ao iniciar o servidor ou conectar ao BD:', error);
    }
}


startServer();

