const { Client } = require("pg");

const createUsersTable = require("./src/schemas/userSchema")

let client;
const initPostgresClient = async () => {
  try {
    client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await client.connect();
  } catch (err) {
    console.log(err);
  }
};

const getClient = () => {
  return client;
};

const createTables = async () => {
  await createUsersTable();
};

exports.createTables = createTables;
exports.initPostgresClient = initPostgresClient;
exports.getClient = getClient;
