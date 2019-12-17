const Assignment = require("../models/model.assignment");
const Course = require("../models/model.course");
const Notification = require("../models/model.notification");
const GCSService = require("../service/service.storage");
const bucketName = "unihub-instructor";

class AssignmentController {

    /**
     * @desc Create a new assignment.
     * @param file
     * @param data
     * @returns {Promise<JSON>}
     */
    static createAssignment(file, data) {

        return new Promise((resolve, reject) => {

            let newAssignment = new Assignment(data);

            newAssignment.attachment = GCSService.getPublicUrl(bucketName, file.name);

            let deadline;

            try {
                deadline = new Date(data.deadline);
            } catch (err) {
                reject({ status: 500, msg: "Something went wrong.", err });
            }

            if (deadline <= Date.now()) {

                reject({ status: 400, msg: "Please select a date and time in the future." });

            } else {

                GCSService.uploadFileToGoogleCloudStorage(bucketName, file)
                    .then(() => {
                        newAssignment
                            .save()
                            .then(assignment => {
                                Course
                                    .findById(assignment.course)
                                    .then(course => {
                                        course.students.forEach(studentId => {
                                            let newNotification = new Notification({
                                                user: studentId,
                                                type: "student",
                                                message: `Your have a new assignment in ${course.name} course.`
                                            });
                                            newNotification
                                                .save()
                                                .then(() => resolve({ status: 200, msg: "Upload successful." }))
                                                .catch(err => reject({
                                                    status: 500,
                                                    msg: "Something went wrong.",
                                                    err
                                                }));
                                        });

                                    })
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                            })
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    })
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            }

        });

    };

    /**
     * @desc Get assignments.
     * @param courseId
     * @returns {Promise<any>}
     */
    static getAssignments(courseId) {

        return new Promise((resolve, reject) => {

            Assignment
                .find({ course: courseId })
                .exec()
                .then(assignments => {
                    assignments.length >= 1
                        ? resolve({ status: 200, assignments })
                        : reject({ status: 404, msg: "There are no any assignments.", assignments });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Change deadline.
     * @param id
     * @param deadline
     * @param currentDeadline
     * @returns {Promise<JSON>}
     */
    static changeDeadline(id, deadline, currentDeadline) {

        return new Promise((resolve, reject) => {

            let deadlineDate, currentDeadlineDate;

            try {

                deadlineDate = new Date(deadline);
                currentDeadlineDate = new Date(currentDeadline);

            } catch (err) {

                reject({ status: 500, msg: "Something went wrong.", err });

            }

            if (deadlineDate <= currentDeadlineDate) {

                reject({ status: 400, msg: "Please select a date and time further than the current deadline." });

            } else {

                Assignment
                    .findByIdAndUpdate(id, { deadline }, { new: true })
                    .exec()
                    .then(assignment => resolve({ status: 200, success: "Deadline updated.", assignment }))
                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

            }

        });

    }

}

module.exports = AssignmentController;