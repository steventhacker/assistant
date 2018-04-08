const Sequelize = require('sequelize');

const databaseUser = process.env.DB_USER || 'assistant';
const databaseHost = process.env.DB_HOST || 'host';
const databasePass = process.env.DB_PASS || 'pass';
const databaseName = 'assistant';
const databaseType = 'mysql';

const sequelize = new Sequelize(databaseName, databaseUser, databasePass, {
  host: databaseHost,
  dialect: databaseType,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  sequelize.sync();


module.exports = sequelize;