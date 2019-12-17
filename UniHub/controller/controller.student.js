const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/keys").jwtSecret;
const Student = require("../models/model.student");

class StudentController {

    /**
     * @desc Create a new student.
     * @param data
     * @returns {Promise<JSON>}
     */
    static createStudent(data) {

        return new Promise((resolve, reject) => {

            let newStudent = new Student(data);

            Student.findOne({ email: data.email })
                .exec()
                .then(student => {

                    if (student) {
                        reject({ status: 400, msg: "Student already exists." });
                    } else {
                        bcrypt
                            .genSalt(10)
                            .then(salt => {

                                //Hashing the password before storing in database.
                                bcrypt
                                    .hash(newStudent.password, salt)
                                    .then(hash => newStudent.password = hash)
                                    .then(() => {

                                        newStudent
                                            .save()
                                            .then(student => {

                                                //Removing the password from returning student object.
                                                student.password = undefined;

                                                //Adding the token to the newly registered student immediately.
                                                jwt.sign({ id: student._id }, jwtSecret, (err, token) => {
                                                    if (err)
                                                        throw err;
                                                    else
                                                        resolve({
                                                            success: "Student created successfully.",
                                                            student,
                                                            token,
                                                            type: "student",
                                                            status: 200
                                                        });
                                                });

                                            })
                                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

                                    })
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

                            })
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    }

                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
        });

    };

    /**
     * @desc Get all students.
     * @returns {Promise<JSON>}
     */
    static getAllStudents() {

        return new Promise((resolve, reject) => {

            Student.find()
                .select("-password")
                .exec()
                .then(students =>
                    students.length >= 1
                        ? resolve({ status: 200, students })
                        : reject({ status: 404, msg: "There are no students.", students })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    };

    /**
     * @desc Get a student by email.
     * @param email
     * @returns {Promise<JSON>}
     */
    static getStudentByEmail(email) {

        return new Promise((resolve, reject) => {

            Student.findOne({ email })
                .select("-password")
                .exec()
                .then(student =>
                    student
                        ? resolve({ status: 200, student })
                        : reject({ status: 404, msg: "Student does not exist." })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get a student by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static getStudentById(id) {

        return new Promise((resolve, reject) => {

            Student.findById(id)
                .select("-password")
                .exec()
                .then(student =>
                    student
                        ? resolve({ status: 200, student })
                        : reject({ status: 404, msg: "Student does not exist." })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Update student by id.
     * @param id
     * @param data
     * @returns {Promise<JSON>}
     */
    static updateStudentById(id, data) {

        return new Promise((resolve, reject) => {

            let updUser = data;

            if (updUser.password) {

                const { currentPassword } = updUser;

                if (!currentPassword) {

                    return reject({ status: 400, msg: "Please enter current password." });

                } else {

                    Student
                        .findById(id)
                        .exec()
                        .then(student => {

                            bcrypt
                                .compare(currentPassword, student.password)
                                .then(isMatch => {
                                    if (isMatch) {

                                        //Hashing the password before storing in database.
                                        bcrypt
                                            .genSalt(10)
                                            .then(salt => {

                                                bcrypt.hash(updUser.password, salt)
                                                    .then(hash => updUser.password = hash)
                                                    .then(() => {

                                                        Student
                                                            .findByIdAndUpdate(id, updUser, { new: true })
                                                            .select("-password")
                                                            .exec()
                                                            .then(user => resolve({
                                                                status: 200,
                                                                success: "Student updated successfully.",
                                                                user
                                                            }))
                                                            .catch(err => reject({
                                                                status: 500,
                                                                msg: "Something went wrong.",
                                                                err
                                                            }));

                                                    })
                                                    .catch(err => reject({
                                                        status: 500,
                                                        msg: "Something went wrong.",
                                                        err
                                                    }));

                                            })
                                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

                                    } else {

                                        reject({ status: 400, msg: "Invalid current password." });

                                    }

                                })
                                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                        });

                }

            } else {

                Student
                    .findByIdAndUpdate(id, updUser, { new: true })
                    .select("-password")
                    .exec()
                    .then(user => resolve({ status: 200, success: "Student updated successfully.", user }))
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            }

        });

    }

    /**
     * @desc Delete student by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static deleteStudentById(id) {

        return new Promise((resolve, reject) => {

            Student.findByIdAndRemove(id, { new: true })
                .select("-password")
                .exec()
                .then(student => resolve({ status: 200, success: "Student successfully deleted.", student }))
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

}

module.exports = StudentController;