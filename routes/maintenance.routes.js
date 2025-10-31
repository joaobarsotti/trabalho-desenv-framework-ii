const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/', maintenanceController.findAll);     
router.post('/', maintenanceController.create);    

router.get('/:id', maintenanceController.findOne);  
router.put('/:id', maintenanceController.update);   
router.delete('/:id', maintenanceController.delete);

module.exports = router;