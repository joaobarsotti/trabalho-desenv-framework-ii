const express = require("express");
const cors = require('cors'); 
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', 
    logging: false 
});

const Equipment = sequelize.define('Equipment', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    serialNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    purchaseDate: { type: DataTypes.DATEONLY },
    value: { type: DataTypes.FLOAT }
});

const Maintenance = sequelize.define('Maintenance', {
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    scheduledDate: { type: DataTypes.DATEONLY, allowNull: false },
});

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false } 
});

Equipment.hasMany(Maintenance, { foreignKey: 'equipmentId', as: 'maintenanceRecords' });
Maintenance.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });