const postgres = require("../../sequelize");

const createUsersTable = async () => {
  const client = postgres.getClient();
  try {
    const query = `CREATE TABLE IF NOT EXISTS users ( 
                    id SERIAL PRIMARY KEY,
                    user_id INT,
                    name VARCHAR(255),
                    contact_number TEXT
                )`;
    await client.query(query);
  } catch (err) {
    console.log(err);
  }
};
module.exports = createUsersTable;
