const express = require("express");
const router = express.Router();
const {
    createEmailConfirmation,
    createPromotionalAnnouncement,

} = require("../controllers/emailConfirmationController");

router.post("/orders/:orderId", createEmailConfirmation);
router.post("/members/:memberId", createPromotionalAnnouncement);

module.exports = router;