const express = require("express");
const router = express.Router();
const {
    createEmailConfirmation,

} = require("../controllers/emailConfirmationController");

router.post("/:orderId", createEmailConfirmation);

module.exports = router;