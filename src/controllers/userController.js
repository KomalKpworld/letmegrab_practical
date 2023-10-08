const crypto = require("crypto");
const { getClient } = require("../../sequelize");

const createSyckContact = async (req, res) => {
  try {
    const client = await getClient();
    const { userId, Contacts } = req.body;

    for (const contact of Contacts) {
      const { name, number } = contact;
      const encryptedNumber = crypto
        .createHash("sha256")
        .update(number)
        .digest("hex");

      const query = {
        text: "SELECT * FROM users WHERE user_id = $1 AND contact_number = $2",
        values: [userId, encryptedNumber],
      };

      const result = await client.query(query);

      if (result.rows.length === 0) {
        const insertQuery = {
          text: "INSERT INTO users(user_id, name, contact_number) VALUES ($1, $2, $3)",
          values: [userId, name, encryptedNumber],
        };

        await client.query(insertQuery);
      }
    }

    return res
      .status(201)
      .send({ success: true, message: "Data saved successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "internal server error" });
  }
};
const getCommonUser = async (req, res) => {
  try {
    const client = await getClient();
    const { searchNumber } = req.query;

    const query = {
      text: "SELECT user_id, name FROM users WHERE contact_number  = $1",
      values: [crypto.createHash("sha256").update(searchNumber).digest("hex")],
    };

    const result = await client.query(query);

    if (result.rows.length === 0) {
      res.status(404).send({ error: "Number not found" });
    } else {
      const commonUsers = result.rows.map((row) => row.user_id);
      const name = result.rows[0].name;

      return res.status(200).send({ Name: name, commonUsers: commonUsers });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "internal server error" });
  }
};
const getUserContact = async (req, res) => {
  try {
    const client = await getClient();
    let { userId, page, PageSize, searchText } = req.query;
    const limit = PageSize || 10
    const offset = (page - 1) * limit;
    let queryText =
      "SELECT name, contact_number  FROM  users WHERE user_id = $1";
    const queryParams = [userId];
    if (searchText) {
      queryText += " AND name ILIKE $2";
      queryParams.push(`%${searchText}%`);
    }

    const countQuery = {
      text: `SELECT COUNT(*) FROM (${queryText}) AS subquery`,
      values: queryParams,
    };

    const dataQuery = {
      text: `${queryText} ORDER BY name LIMIT $${
        queryParams.length + 1
      } OFFSET $${queryParams.length + 2}`,
      values: [...queryParams, limit, offset],
    };

    const [totalCountResult, contactsResult] = await Promise.all([
      client.query(countQuery),
      client.query(dataQuery),
    ]);

    const totalCount = parseInt(totalCountResult?.rows[0]?.count);

    const rows = contactsResult.rows;

    res.json({ totalCount: totalCount, rows: rows });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "internal server error" });
  }
};

module.exports = { getUserContact, getCommonUser, createSyckContact };
