const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Додавання авто
router.post('/add', carController.addCar);

// Аналіз і ранжування
router.get('/analyze', carController.getRanked);

module.exports = router;