const db = require('../models');
const { Maintenance, Equipment } = db;

exports.findAll = async (req, res) => {
    try {
        const maintenances = await Maintenance.findAll({
            include: [{ model: Equipment, as: 'equipment', attributes: ['name', 'serialNumber'] }]
        });
        res.json(maintenances);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar manutenções.' });
    }
};

exports.create = async (req, res) => {
    try {
        const newMaintenance = await Maintenance.create(req.body);
        res.status(201).json(newMaintenance);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Erro ao criar manutenção.' });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const maintenance = await Maintenance.findByPk(id);
        if (maintenance) {
            res.json(maintenance);
        } else {
            res.status(404).json({ error: "Manutenção não encontrada." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar manutenção.' });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const [updatedRows] = await Maintenance.update(req.body, { where: { id } });
        
        if (updatedRows > 0) {
            const updatedMaintenance = await Maintenance.findByPk(id);
            res.json(updatedMaintenance);
        } else {
            res.status(404).json({ error: "Manutenção não encontrada para atualização." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message || 'Erro ao atualizar manutenção.' });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedRows = await Maintenance.destroy({ where: { id } });
        if (deletedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Manutenção não encontrada para exclusão." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir manutenção.' });
    }
};