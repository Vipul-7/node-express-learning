const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb")

class User {
	constructor(userName, email, cart, id) {
		this.userName = userName;
		this.email = email;
		this.cart = id
		this._id = id
	}

	save() {
		const db = getDb();

		return db.collection("users").insertOne(this);
	}

	addToCart(product) {
		// const cartProduct = this.cart.items.findIndex(p => p._id = product._id)

		const updatedCart = { items: [{ ...product, quantity: 1 }] }
		const db = getDb();
		return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, {
			$set: {
				cart: updatedCart
			}
		})
	}

	static findById(userId) {
		const db = getDb();

		return db.collection("users").find({ _id: new ObjectId(userId) }).next().then(user => {
			// console.log(user)
			return user
		}).catch(err => console.log(err))
	}
}

module.exports = User;
