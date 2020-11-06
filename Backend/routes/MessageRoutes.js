var express = require("express");
var router = express.Router();

const MessageController = require("../controllers/MessageController.js");
const grant_access = require('../middlewares/auth').grant_access
const verifyToken = require('../middlewares/auth').verifyToken

router.get("/api/messages/", MessageController.getAllMessages);
router.get("/api/messages/email/:email", MessageController.getMessageByEmail);
router.get("/api/messages/:id", MessageController.getMessageById);

router.post("/api/messages", MessageController.postMessage);
router.delete("/api/messages/", verifyToken, grant_access('deleteAny', 'message'), MessageController.deleteMessages);

module.exports = router;