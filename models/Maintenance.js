const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Maintenance = sequelize.define('Maintenance', {
        type: { type: DataTypes.STRING, allowNull: false }, 
        description: { type: DataTypes.TEXT, allowNull: false },
        scheduledDate: { type: DataTypes.DATEONLY, allowNull: false }
    });
    return Maintenance;
};