const { Sequelize, DataTypes, Op } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

const connectionOptions = isProduction ? {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        }
    }
} : {
    dialect: 'sqlite',
    storage: 'database.sqlite',
};

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', 
    logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize);
db.Equipment = require('./Equipment')(sequelize);
db.Maintenance = require('./Maintenance')(sequelize);

const User = db.User;
const Equipment = db.Equipment;
const Maintenance = db.Maintenance;

Equipment.hasMany(Maintenance, { foreignKey: 'equipmentId', as: 'maintenanceRecords' });
Maintenance.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

module.exports = db;