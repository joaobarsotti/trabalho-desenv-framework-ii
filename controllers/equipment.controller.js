const db = require('../models');
const Equipment = db.Equipment;

exports.findAll = async (req, res) => {
    try {
        const equipments = await Equipment.findAll(); 
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar equipamentos.' });
    }
};

exports.create = async (req, res) => {
    try {
        const newEquipment = await Equipment.create(req.body);
        res.status(201).json(newEquipment);
    } catch (error) {
        res.status(400).json({ error: error.message || 'Erro ao criar equipamento.' }); 
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const equipment = await Equipment.findByPk(id);
        if (equipment) {
            res.json(equipment);
        } else {
            res.status(404).json({ error: "Equipamento não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar equipamento.' });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const [updatedRows] = await Equipment.update(req.body, { where: { id } });
        
        if (updatedRows > 0) {
            const updatedEquipment = await Equipment.findByPk(id);
            res.json(updatedEquipment);
        } else {
            res.status(404).json({ error: "Equipamento não encontrado para atualização." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message || 'Erro ao atualizar equipamento.' });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedRows = await Equipment.destroy({ where: { id } });
        if (deletedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Equipamento não encontrado para exclusão." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir equipamento.' });
    }
};