const mongoose = require("mongoose")

const Schema = mongoose.Schema

const orderScehma = new Schema({
    products: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

})

module.exports = mongoose.model("Order", orderScehma)

orderScehma.method