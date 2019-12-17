const bcrypt = require("bcryptjs");
const genPass = require("generate-password");
const Admin = require("../models/model.admin");
const MailService = require("../service/service.mail");

class AdminController {

    /**
     * @desc Create a new admin.
     * @param data
     * @returns {Promise<JSON>}
     */
    static createAdmin(data) {

        return new Promise((resolve, reject) => {

            let newAdmin = new Admin(data);
            let password = genPass.generate({length: 4});

            bcrypt.genSalt(10)
                .then(salt =>
                    bcrypt
                        .hash(password, salt)
                        .then(hash => newAdmin.password = hash)
                        .catch(err => reject({ status: 500, msg: "Something went wrong.", err }))
                )
                .then(() =>
                    Admin
                        .findOne({ email: newAdmin.email })
                        .exec()
                        .then(admin => {
                            if (admin) {
                                reject({ status: 404, msg: "Admin already exists." });
                            } else {
                                newAdmin
                                    .save()
                                    .then(admin => {
                                        MailService.sendMail(admin, password, 'Admin');
                                        admin.password = undefined;
                                        return admin;
                                    })
                                    .then(admin => resolve({
                                        status: 200,
                                        msg: "Admin created successfully.",
                                        admin
                                    }))
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                            }
                        })
                        .catch(err => reject({ status: 500, msg: "Something went wrong.", err }))
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get all admins.
     * @returns {Promise<JSON>}
     */
    static getAllAdmins() {

        return new Promise((resolve, reject) => {

            Admin.find()
                .select("-password")
                .exec()
                .then(admins => {
                    admins.length >= 1
                        ? resolve({ status: 200, admins })
                        : reject({ status: 404, msg: "There are no any admins.", admins });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get admin by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static getAdminById(id) {

        return new Promise((resolve, reject) => {

            Admin.findById(id)
                .select("-password")
                .exec()
                .then(admin => {
                    admin
                        ? resolve({ status: 200, admin })
                        : reject({ status: 404, msg: "Admin does not exist." });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get admin by email.
     * @param email
     * @returns {Promise<JSON>}
     */
    static getAdminByEmail(email) {

        return new Promise((resolve, reject) => {

            Admin.findOne({ email })
                .select("-password")
                .exec()
                .then(admin => {
                    admin
                        ? resolve({ status: 200, admin })
                        : reject({ status: 404, msg: "Admin does not exist." });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Update admin by id.
     * @param id
     * @param data
     * @returns {Promise<JSON>}
     */
    static updateAdminById(id, data) {

        return new Promise((resolve, reject) => {

            let updAdmin = data;

            if (updAdmin.password) {

                const { currentPassword } = updAdmin;
                if (!currentPassword)
                    return reject({ status: 400, msg: "Please enter current password." });

                bcrypt
                    .genSalt(10)
                    .then(salt => {
                        bcrypt
                            .hash(updAdmin.password, salt)
                            .then(hash => updAdmin.password = hash)
                            .then(() => {
                                Admin
                                    .findByIdAndUpdate(id, updAdmin, { new: true })
                                    .select("-password")
                                    .exec()
                                    .then(user => resolve({ status: 200, success: "Admin updated successfully.", user }))
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                            })
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    })
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            } else {

                Admin
                    .findByIdAndUpdate(id, updAdmin, { new: true })
                    .select("-password")
                    .exec()
                    .then(user => resolve({ status: 200, success: "Admin updated successfully.", user }))
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            }

        });

    }

    /**
     * @desc Delete admin by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static deleteAdminById(id) {

        return new Promise((resolve, reject) => {

            Admin.findByIdAndRemove(id, { new: true })
                .select("-password")
                .exec()
                .then(admin => resolve({ status: 200, msg: "Admin deleted.", admin }))
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

}

module.exports = AdminController;