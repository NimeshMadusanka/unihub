const Notification = require("../models/model.notification");

class NotificationController {

    /**
     * @desc Get notifications for a user.
     * @param userId
     * @returns {Promise<any>}
     */
    static getNotifications(userId) {

        return new Promise((resolve, reject) => {

            Notification
                .find({ user: userId })
                .exec()
                .then(notifications => {
                    notifications.length > 0
                        ? resolve({ status: 200, notifications })
                        : reject({ status: 404, msg: "Could not find any notifications.", notifications });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

}

module.exports = NotificationController;