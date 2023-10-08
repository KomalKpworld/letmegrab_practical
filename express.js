const { initPostgresClient, createTables } = require("./sequelize");
const userContactRouter = require("./src/routes/userRouter")
const bodyParser = require("body-parser");
const express = require("express");

const initializeExpress = (http) => {
  const PORT = process.env.PORT || 3001;
  http.listen(PORT, async () => {
    console.log(`⚡️ Express app is running on port: ${PORT}`);
    await initPostgresClient();
    await createTables();
  });
};

const handleRequests = (app) => {
  app.use(bodyParser.json());
  app.use("/", userContactRouter);
};

module.exports={handleRequests , initializeExpress}

