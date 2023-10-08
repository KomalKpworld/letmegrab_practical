const express = require("express");
const { getCommonUser, getUserContact, createSyckContact } = require("../controllers/userController")
const userContactRouter = express.Router();


userContactRouter.get('/api/find-common-users', getCommonUser)
userContactRouter.post('/api/sync-contacts', createSyckContact)
userContactRouter.get('/api/get-contacts',getUserContact )

module.exports = userContactRouter ;