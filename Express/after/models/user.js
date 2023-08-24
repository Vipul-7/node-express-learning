const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");
const { get } = require("../routes/admin");

class User {
	constructor(userName, email, cart, id) {
		this.userName = userName;
		this.email = email;
		this.cart = cart
		this._id = id
	}

	save() {
		const db = getDb();

		return db.collection("users").insertOne(this);
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex(p => p.productId.toString() === product._id.toString())
		// console.log(this.cart)

		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		}
		else {
			updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 })
		}

		const updatedCart = { items: updatedCartItems }
		const db = getDb();
		return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, {
			$set: {
				cart: updatedCart
			}
		})
	}

	getCart() {
		const db = getDb();

		// console.log(this.cart)
		const productIds = this.cart.items.map(product => product.productId);

		return db.collection("products").find({ _id: { $in: productIds } }) // it will find all the ids that mentioned in productIds array
			.toArray().then(products => {
				return products.map(p => {
					return {
						...p,
						quantity: this.cart.items.find(i => {
							return i.productId.toString() === p._id.toString();
						}).quantity
					}
				})
			})
	}

	deleteItemFromCart(prodId) {
		const updatedCartItems = this.cart.items.filter(item => item.productId.toString() != prodId.toString())

		const db = getDb();

		return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, {
			$set: {
				cart: { items: updatedCartItems }
			}
		})
	}

	addOrder() {
		const db = getDb();

		return this.getCart().then(products => {
			const order = {
				items: products,
				user: {
					_id: new ObjectId(this._id),
					name: this.name,
					email: this.email
				}
			}

			return db.collection("orders").insertOne(order)

		}).
			then(result => {
				this.cart = { items: [] };
				return db.collection("users").updateOne({ _id: new ObjectId(this._id) }, {
					$set: {
						cart: { items: [] }
					}
				})
			})
	}

	getOrders() {
		const db = getDb();

		return db.collection("orders").find({ "user._id": new ObjectId(this._id) }).toArray();
	}

	static findById(userId) {
		const db = getDb();

		return db.collection("users").find({ _id: new ObjectId(userId) }).next().then(user => {
			return user
		}).catch(err => console.log(err))
	}
}

module.exports = User;
