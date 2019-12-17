const Instructor = require("../models/model.instructor");
const bcrypt = require("bcryptjs");
const genPass = require("generate-password");
const MailService = require("../service/service.mail");

class InstructorController {

    /**
     * @desc Create a new instructor and send login details to their email.
     * @param data
     * @returns {Promise<JSON>}
     */
    static createInstructor(data) {

        return new Promise((resolve, reject) => {

            let newInstructor = Instructor(data);
            let password = genPass.generate({ length: 4 });
            bcrypt.genSalt(10)
                .then(salt =>
                    bcrypt
                        .hash(password, salt)
                        .then(hash => newInstructor.password = hash)
                        .catch(err => reject({ status: 500, msg: "Something went wrong.", err }))
                )
                .then(() =>
                    Instructor
                        .findOne({ email: newInstructor.email })
                        .exec()
                        .then(instructor => {
                            if (instructor) {
                                reject({ status: 404, msg: "Instructor already exists." });
                            } else {
                                newInstructor
                                    .save()
                                    .then(instructor => {
                                        let message = MailService.getUserCreatedMessage(instructor, password, 'Instructor');
                                        MailService.sendMail(instructor.email, "UniHub Account", message);
                                        instructor.password = undefined;
                                        return instructor;
                                    })
                                    .then(instructor => resolve({
                                        status: 200,
                                        msg: "Instructor created successfully.",
                                        instructor
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
     * @desc Get all instructors.
     * @returns {Promise<any>}
     */
    static getAllInstructors() {

        return new Promise((resolve, reject) => {

           Instructor
               .find()
               .select('-password')
               .exec()
               .then(instructors =>
                   instructors.length >= 1
                       ? resolve({ status: 200, instructors })
                       : reject({ status: 404, msg: "Could not find any instructors.", instructors })
               )
               .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get instructor by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static getInstructorById(id) {

        return new Promise((resolve, reject) => {

            Instructor
                .findById(id)
                .select("-password")
                .exec()
                .then(instructor => {
                    instructor
                        ? resolve({ status: 200, instructor })
                        : reject({ status: 404, msg: "Instructor does not exist." });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get instructor by email.
     * @param email
     * @returns {Promise<JSON>}
     */
    static getInstructorByEmail(email) {

        return new Promise((resolve, reject) => {

            Instructor
                .findOne({ email })
                .select("-password")
                .exec()
                .then(instructor => {
                    instructor
                        ? resolve({ status: 200, instructor })
                        : reject({ status: 404, msg: "Instructor does not exist." });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Update instructor by id.
     * @param id
     * @param data
     * @returns {Promise<JSON>}
     */
    static updateInstructorById(id, data) {

        return new Promise((resolve, reject) => {

            let updInstructor = data;

            if (updInstructor.password) {

                const { currentPassword } = updInstructor;
                if (!currentPassword)
                    return reject({ status: 400, msg: "Please enter current password." });

                bcrypt.genSalt(10)
                    .then(salt => {
                        bcrypt.hash(updInstructor.password, salt)
                            .then(hash => updInstructor.password = hash)
                            .then(() => {
                                Instructor
                                    .findByIdAndUpdate(id, updInstructor, { new: true })
                                    .select("-password")
                                    .exec()
                                    .then(user => resolve({
                                        status: 200,
                                        success: "Instructor updated successfully.",
                                        user
                                    }))
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                            })
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    })
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            } else {

                Instructor
                    .findByIdAndUpdate(id, updInstructor, { new: true })
                    .select("-password")
                    .exec()
                    .then(user => resolve({ status: 200, success: "Instructor updated successfully.", user }))
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            }

        });

    }

    /**
     * @desc Delete instructor by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static deleteInstructorById(id) {

        return new Promise((resolve, reject) => {

            Instructor
                .findByIdAndRemove(id, { new: true })
                .select("-password")
                .exec()
                .then(instructor => resolve({ status: 200, msg: "Instructor deleted.", instructor }))
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

}

module.exports = InstructorController;