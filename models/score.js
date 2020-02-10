const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    total: { type: Number, default: 0 },
    scoreboard: [{
        score: {
            type: Number,
        },
        outof: {
            type:Number,
        },
        category: {
            type: String,
        },
        date: {
            type: Date,
            default: new Date()
        }
    }]
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;