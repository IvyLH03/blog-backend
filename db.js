import postgres from 'postgres'
import "./loadEnv.js";

const sql = postgres('postgres://username:password@host:port/database', {
  host                 : process.env.DB_HOST,            // Postgres ip address[s] or domain name[s]
  port                 : process.env.DB_PORT,          // Postgres server port[s]
  database             : process.env.DB_DATABASE,            // Name of database to connect to
  username             : process.env.DB_USERNAME,            // Username of database user
  password             : process.env.DB_PASSWORD,            // Password of database user
})

console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)


export default sql