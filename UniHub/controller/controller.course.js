const Course = require("../models/model.course");
const MailService = require("../service/service.mail");
const mongoose = require("mongoose");
const Notification = require("../models/model.notification");

class CourseController {

    /**
     * @desc Create a new course.
     * @param data
     * @param instructor
     * @returns {Promise<JSON>}
     */
    static createCourse(data, instructor) {

        return new Promise((resolve, reject) => {

            let newCourse = new Course(data);
            newCourse.instructor = instructor;

            Course
                .findOne({ code: data.code })
                .exec()
                .then(course => {
                    if (course) {
                        reject({ status: 400, msg: "Course already exists." });
                    } else {
                        newCourse
                            .save()
                            .then(course => {
                                let message = MailService.getAddedToCourseMessage(course);
                                MailService.sendMail(instructor.email, "Assigned to a course", message);
                                return course;
                            })
                            .then(course => {
                                let newNotification = new Notification({
                                    user: course.instructor._id,
                                    type: 'instructor',
                                    message: `You have been assigned to ${course.name} course. Go to courses to accept or reject.`
                                });
                                newNotification
                                    .save()
                                    .then(() => resolve({ status: 200, msg: "Course created successfully.", course }))
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                            })
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    }
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get all courses.
     * @returns {Promise<JSON>}
     */
    static getAllCourses() {

        return new Promise((resolve, reject) => {

            Course
                .find()
                .exec()
                .then(courses =>
                    courses.length >= 1
                        ? resolve({ status: 200, courses })
                        : reject({ status: 404, msg: "Could not find any courses.", courses })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get joined courses for a student.
     * @returns {Promise<JSON>}
     */
    static getJoinedCourses(studentId) {

        return new Promise((resolve, reject) => {

            Course
                .find({ students: studentId })
                .exec()
                .then(courses =>
                    courses.length >= 1
                        ? resolve({ status: 200, courses })
                        : reject({ status: 404, msg: "Could not find any courses.", courses })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get accepted courses.
     * @returns {Promise<JSON>}
     */
    static getAcceptedCourses() {

        return new Promise((resolve, reject) => {

            Course
                .find({ status: "accepted" })
                .exec()
                .then(courses =>
                    courses.length >= 1
                        ? resolve({ status: 200, courses })
                        : reject({ status: 404, msg: "Could not find any courses.", courses })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get courses by instructor.
     * @param instructorId
     * @returns {Promise<JSON>}
     */
    static getCoursesByInstructor(instructorId) {

        return new Promise((resolve, reject) => {

            Course
                .find({ "instructor._id": mongoose.Types.ObjectId(instructorId) })
                .exec()
                .then(courses =>
                    courses.length >= 1
                        ? resolve({ status: 200, courses })
                        : reject({ status: 404, msg: "Could not find any courses.", courses })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get course by id.
     * @param id
     * @returns {Promise<JSON>}
     */
    static getCourseById(id) {

        return new Promise((resolve, reject) => {

            Course
                .findById(id)
                .then(course =>
                    course
                        ? resolve({ status: 200, course })
                        : reject({ status: 404, msg: "Could not find the course." })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get course by code.
     * @param code
     * @returns {Promise<JSON>}
     */
    static getCourseByCode(code) {

        return new Promise((resolve, reject) => {

            Course
                .findOne({ code })
                .then(course =>
                    course
                        ? resolve({ status: 200, course })
                        : reject({ status: 404, msg: "Could not find the course." })
                )
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Add a student to the course.
     * @param courseId
     * @param studentId
     * @returns {Promise<JSON>}
     */
    static addStudent(courseId, studentId) {

        return new Promise((resolve, reject) => {

            let index = false;

            Course
                .findById(courseId)
                .then(course => course.students.forEach(id => {
                    if (id === studentId) {
                        index = true;
                        reject({ status: 400, msg: "Already joined to the course." });
                    }
                }))
                .then(() => {
                    if (index === false) {
                        Course
                            .findByIdAndUpdate(courseId, { $push: { students: studentId } })
                            .exec()
                            .then(course => resolve({
                                status: 200,
                                msg: `Student added to the ${course.name}.`,
                                course
                            }))
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    }
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Remove a student to the course.
     * @param courseId
     * @param studentId
     * @returns {Promise<JSON>}
     */
    static removeStudent(courseId, studentId) {

        return new Promise((resolve, reject) => {

            let index = false;

            Course
                .findById(courseId)
                .then(course => course.students.forEach(id => {
                    if (id === studentId) {
                        index = true;
                    }
                }))
                .then(() => {
                    if (index === true) {
                        Course
                            .findByIdAndUpdate(courseId, { $pull: { students: studentId } })
                            .exec()
                            .then(course => resolve({
                                status: 200,
                                msg: `Student removed from the ${course.name}.`,
                                course
                            }))
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    } else {
                        reject({ status: 400, msg: "Student is not in this course." });
                    }
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Replace the instructor of a course.
     * @param courseId
     * @param instructor
     * @returns {Promise<any>}
     */
    static replaceInstructor(courseId, instructor) {

        return new Promise((resolve, reject) => {

            Course
                .findByIdAndUpdate(courseId, { instructor: instructor, status: "pending" })
                .then(course => {
                    let newNotification = new Notification({
                        user: course.instructor._id,
                        type: 'instructor',
                        message: `You have been assigned to ${course.name} course. Go to courses to accept or reject.`
                    });
                    newNotification
                        .save()
                        .then(() => resolve({ status: 200, msg: `Instructor added to ${course.name}.`, course }))
                        .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Accept the course by assigned instructor.
     * @param id
     * @returns {Promise<JSON>}
     */
    static acceptCourse(id) {

        return new Promise((resolve, reject) => {

            Course
                .findByIdAndUpdate(id, { status: "accepted" }, { new: true })
                .exec()
                .then(course => resolve({
                    status: 200,
                    msg: `${course.instructor.name} accepted ${course.name}.`,
                    course
                }))
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Reject the course by assigned instructor.
     * @param id
     * @returns {Promise<JSON>}
     */
    static rejectCourse(id) {

        return new Promise((resolve, reject) => {

            Course
                .findByIdAndUpdate(id, { status: "rejected" }, { new: true })
                .exec()
                .then(course => resolve({
                    status: 200,
                    msg: `${course.instructor.name} rejected ${course.name}.`,
                    course
                }))
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

}

module.exports = CourseController;