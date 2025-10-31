const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/', equipmentController.findAll);    
router.post('/', equipmentController.create);     

router.get('/:id', equipmentController.findOne);  
router.put('/:id', equipmentController.update);   
router.delete('/:id', equipmentController.delete); 

module.exports = router;