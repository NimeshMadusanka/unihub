const Assignment = require("../models/model.assignment");
const Solution = require("../models/model.solution");
const Notification = require("../models/model.notification");
const GCSService = require("../service/service.storage");
const bucketName = "unihub-student";

class SolutionController {

    /**
     * @desc Add solution for an solution.
     * @param studentId
     * @param courseId
     * @param assignmentId
     * @param file
     * @returns {Promise<JSON>}
     */
    static addSolution(studentId, assignmentId, courseId, file) {

        return new Promise((resolve, reject) => {

            Solution
                .findOne({ student: studentId, assignment: assignmentId, course: courseId })
                .exec()
                .then(solution => {

                    Assignment
                        .findById(assignmentId)
                        .exec()
                        .then(assignment => {
                            if (assignment) {

                                let deadline;

                                try {
                                    deadline = new Date(assignment.deadline);
                                } catch (err) {
                                    reject({ status: 500, msg: "Something went wrong." });
                                }

                                if (deadline >= Date.now()) {

                                    let newSolution = new Solution({
                                        student: studentId,
                                        course: courseId,
                                        assignment: assignmentId,
                                        attachment: GCSService.getPublicUrl(bucketName, file.name)
                                    });

                                    GCSService
                                        .uploadFileToGoogleCloudStorage(bucketName, file)
                                        .then(() => {

                                            if (solution) {

                                                Solution
                                                    .findByIdAndUpdate(solution._id, {
                                                        attachment: GCSService.getPublicUrl(bucketName, file.name)
                                                    }, { new: true })
                                                    .then(() => {
                                                        resolve({ status: 200, msg: "Upload successful." });
                                                    })
                                                    .catch(err => reject({
                                                        status: 500,
                                                        msg: "Something went wrong.",
                                                        err
                                                    }));

                                            } else {

                                                newSolution
                                                    .save()
                                                    .then(() => {
                                                        resolve({ status: 200, msg: "Upload successful." });
                                                    })
                                                    .catch(err => reject({
                                                        status: 500,
                                                        msg: "Something went wrong.",
                                                        err
                                                    }));

                                            }

                                        })
                                        .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

                                } else {
                                    reject({ status: 400, msg: "Assignment is overdue." });
                                }

                            } else {
                                reject({ status: 404, msg: "Could not find the solution." });
                            }

                        })
                        .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));


        });

    }

    /**
     * @desc Get solution.
     * @param studentId
     * @param assignmentId
     * @param courseId
     * @returns {Promise<JSON>}
     */
    static getSolution(studentId, assignmentId, courseId) {

        return new Promise((resolve, reject) => {

            Solution
                .findOne({ student: studentId, assignment: assignmentId, course: courseId })
                .exec()
                .then(solution => {
                    solution
                        ? resolve({ status: 200, solution })
                        : reject({ status: 404, msg: "Could not find the solution." });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get solutions for an assignment.
     * @param assignmentId
     * @returns {Promise<JSON>}
     */
    static getSolutions(assignmentId) {

        return new Promise((resolve, reject) => {

            Solution
                .find({ assignment: assignmentId })
                .exec()
                .then(solutions => {
                    solutions
                        ? resolve({ status: 200, solutions })
                        : reject({ status: 404, msg: "Could not find any solutions." });
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

    /**
     * @desc Get solutions for an assignment.
     * @returns {Promise<JSON>}
     * @param solutionId
     * @param marks
     */
    static gradeSolution(solutionId, marks) {

        return new Promise((resolve, reject) => {

            Solution
                .findByIdAndUpdate(solutionId, { marks }, { new: true })
                .exec()
                .then(solution => {
                    if (solution) {
                        Assignment
                            .findById(solution.assignment)
                            .then(assignment => {
                                let newNotification = new Notification({
                                    user: solution.student,
                                    type: "student",
                                    message: `Your solution for ${assignment.name} has been graded.`
                                });
                                newNotification
                                    .save()
                                    .then(() => resolve({ status: 200, success: "Solution graded.", solution }))
                                    .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                            })
                            .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));
                    } else {
                        reject({ status: 404, msg: "Could not find the solution." });
                    }
                })
                .catch(err => reject({ status: 500, msg: "Something went wrong.", err }));

        });

    }

}

module.exports = SolutionController;