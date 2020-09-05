const mongoose = require('mongoose');

const TalhaoSchema = new mongoose.Schema({
    talhaoId : {
        type: String,
        required: [true, 'Informe um ID'],
        unique: true,
        trim: true,
        maxlength:  [10, 'ID deve ser menor que 10 caracteres'],
    },
    address: {
        type: String,
        required: [true, 'Informe um endereço']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Talhao', TalhaoSchema);