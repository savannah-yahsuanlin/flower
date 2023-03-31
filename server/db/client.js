const {Pool} = require('pg')

const conn = process.env.DATABASE_URL || 'postgres://localhost:5432/flower'

const client = new Pool({
	conn,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

module.exports = client