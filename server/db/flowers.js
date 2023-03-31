const client = require('./client')

async function createFlower({name, price, description, shipping, weight, picture}) {
	try {
		const flower = `
			INSERT INTO flowers(name, price, description, shipping, weight, picture)
			VALUES ($1,$2,$3,$4,$5,$6)
			RETURNING *
		`
		const response = await client.query(flower, [name, price, description, shipping, weight, picture])
		return response.row[0]
	} catch (error) {
		console.error("Error creating flowers");
		throw error
	}
}

async function getFlowerById(id) {
	try {
		const {row: [flowerId]} = await client.query(`
			SELECT name, price FROM flowers WHERE id=$1
		`, [id])
		return flowerId
	} catch (error) {
		console.log(error)
	}
}

async function getAllFlowers() {
	try {
		const {rows} = await client.query(`
			SELECT * FROM flowers;
		`)
		return rows
	} catch (error) {
		console.log(error)
	}
}


module.exports = {
	createFlower,
	getFlowerById,
	getAllFlowers
}