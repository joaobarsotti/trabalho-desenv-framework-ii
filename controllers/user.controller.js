const db = require('../models');
const User = db.User;

const excludePassword = (user) => {
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword;
};

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
};

exports.create = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(excludePassword(newUser));
    } catch (error) {
        res.status(400).json({ error: error.message || 'Erro ao criar usuário.' }); 
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id, {
             attributes: { exclude: ['password'] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Usuário não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    
    try {
        const [updatedRows] = await User.update(req.body, { 
            where: { id },
            individualHooks: true
        });
        
        if (updatedRows > 0) {
            const updatedUser = await User.findByPk(id);
            res.json(excludePassword(updatedUser));
        } else {
            res.status(404).json({ error: "Usuário não encontrado para atualização." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message || 'Erro ao atualizar usuário.' });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedRows = await User.destroy({ where: { id } });
        if (deletedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: "Usuário não encontrado para exclusão." });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
};