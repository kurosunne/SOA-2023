const Sequelize = require("sequelize")
const config = require("../config/config.json")
const {host,port,username,password,database,dialect} = config.connection
const connection = new Sequelize(database,username,password,{
    host : host,
    port : port,
    dialect : dialect
})

module.exports = connection