const client = require('./client')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getUserByUsername = async (username) => {
	try {
		const {rows:[user]} = await client.query(`
			SELECT * FROM users WHERE username = $1
		`, [username])
		return user
	} catch (error) {
		console.error('can not get user by username')
	}
}

const createUser = async({username, password}) => {
	const saltRounds = 15

	try {
		const hashPassword = await bcrypt.hash(password, saltRounds)
		const {rows:[user]} = await client.query(`
			INSERT INTO users(username, password)
			VALUES($1, $2)
			RETURNING id, username
		`, [username, hashPassword])
		return user
	} catch (error) {
		console.error('error creating user')
		throw error
	}
}

const getUserByToken = async (token) => {
	try {
		const payload = await jwt.verify(token, process.env.JWT_SECRET)
		const SQL = `
			SELECT users.*
			FROM users
			WHERE id = $1
		`
		const response = await client.query(SQL, [payload.id])
		if(!response.rows.length) {
			const error = Error('no authorized')
			error.status = 401
			throw error
		}
		const user = response.rows[0]
		delete user.password
		return user
	} catch (error) {
		console.log(error)
	}
}

const authenticate = async({username, password}) => {
	const SQL = `
		SELECT id, username, password
		FROM users
		WHERE username = $1
	`
	const response = await client.query(SQL, [username])
	if(!response.rows.length || !(await bcrypt.compare(password, response.rows[0].password))) {
		const error = Error('no authorized')
		error.status = 401
		throw error
	}
	return jwt.sign({id: response.rows[0].id, username: response.rows[0].username}, process.env.JWT_SECRET)
}

module.exports = {
	getUserByUsername,
	createUser,
	getUserByToken,
	authenticate
}