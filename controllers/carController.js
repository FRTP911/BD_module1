const Car = require('../models/Car');
const analysisService = require('../services/analysisService');
const reasoningService = require('../services/reasoningService');

// Додати авто
exports.addCar = async (req, res, next) => {
  try {
    const car = new Car(req.body);
    await car.save();

    res.status(201).json({
      message: "Авто успішно додано"
    });
  } catch (err) {
    next(err);
  }
};

// Аналіз
exports.getRanked = async (req, res, next) => {
  try {
    const cars = await Car.find();

    const ranked = analysisService.calculate(cars);

    const result = ranked.map(car => ({
      ...car,
      reason: reasoningService.getReason(car, ranked)
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};