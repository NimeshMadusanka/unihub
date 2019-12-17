const express = require("express");
const router = express.Router();
const NotificationController = require("../controller/controller.notification");

/**
 * @route GET api/notification
 * @desc Retrieve notifications for a user.
 * @access Public.
 */
router.get("/:userId", (req, res) => {

    NotificationController
        .getNotifications(req.params.userId)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

module.exports = router;