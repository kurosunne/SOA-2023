const express = require('express')
const { registerUser, loginUser, updateUser, addFriend, viewFriend, sendMessage, viewMessage } = require('../controllers/users')
const router = express.Router()

router.post("/user", registerUser)
router.post("/login", loginUser)
router.put("/user/:username", updateUser)
router.post("/friend", addFriend)
router.get("/friend/:username", viewFriend)
router.post("/message", sendMessage)
router.get("/message/:username", viewMessage)

module.exports = router