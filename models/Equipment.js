const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Equipment = sequelize.define('Equipment', {
        name: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        serialNumber: { type: DataTypes.STRING, allowNull: false, unique: true},
        purchaseDate: { type: DataTypes.DATEONLY },
        value: { type: DataTypes.FLOAT}
    });
    return Equipment;
};