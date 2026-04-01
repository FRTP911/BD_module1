const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: { 
        type: String, 
        required: [true, "Марка обов'язкова"],
        match: [/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ\s-]+$/, "Марка має містити лише літери"]
    },
    model: { 
        type: String, 
        required: [true, "Модель обов'язкова"] 
    },
    year: { 
        type: Number, 
        required: [true, "Рік обов'язковий"],
        min: [1990, "Рік має бути не раніше 1990"],
        max: [2026, "Рік не може бути в майбутньому"]
    },
    price: { 
        type: Number, 
        required: [true, "Ціна обов'язкова"], 
        min: [1, "Ціна має бути більшою за 0"] 
    },
    engineReliability: { 
        type: Number, 
        required: [true, "Надійність обов'язкова"], 
        min: [0, "Надійність не може бути від'ємною"] 
    },
    fuelConsumption: { 
        type: Number, 
        required: [true, "Витрати палива обов'язкові"], 
        min: [0.1, "Витрати мають бути більшими за 0"] 
    },
    carClass: { 
        type: String, 
        required: true,
        enum: {
            values: ['економ', 'комфорт', 'бізнес'],
            message: 'Оберіть клас із списку'
        }
    },
    maintenanceCost: { 
        type: Number, 
        required: true, 
        min: [0, "Вартість не може бути від'ємною"] 
    },
    insuranceCost: { 
        type: Number, 
        required: true, 
        min: [0, "Страхування не може бути від'ємним"] 
    }
});

module.exports = mongoose.model('Car', carSchema);