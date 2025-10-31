const express = require('express');
const router = express.Router();
const users = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, users.findAll);          
router.post('/', authenticateToken, users.create);         
router.get('/:id', authenticateToken, users.findOne);      
router.put('/:id', authenticateToken, users.update);       
router.delete('/:id', authenticateToken, users.delete);    

module.exports = router;