const express = require("express");
const fileUpload = require("express-fileupload");
const authStudent = require("../middleware/authentication.student");
const authInstructor = require("../middleware/authentication.instructor");
const SolutionController = require("../controller/controller.solution");

const router = express.Router();

router.use(fileUpload({ createParentPath: true }));

/**
 * @route POST api/assignment/{assignmentId}/course/{courseId}/student/{studentId}
 * @desc Submit a solution.
 * @access Private.
 */
router.post("/assignment/:assignmentId/course/:courseId/student/:studentId", authStudent, (req, res) => {

    const { files } = req;

    if (files === null) {

        return res.status(400).json({ msg: "No file uploaded" });

    } else {

        files.file.name = Date.now() + files.file.name;

        const { assignmentId, courseId, studentId } = req.params;

        SolutionController
            .addSolution(studentId, assignmentId, courseId, files.file)
            .then(result => res.json(result))
            .catch(err => res.status(err.status).json(err));

    }

});

/**
 * @route GET api/solution
 * @desc Get a solution.
 * @access Public.
 */
router.get("/assignment/:assignmentId/course/:courseId/student/:studentId", (req, res) => {

    const { assignmentId, courseId, studentId } = req.params;

    SolutionController
        .getSolution(studentId, assignmentId, courseId)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route GET api/solution/assignment/{assignmentId}
 * @desc Get a solutions.
 * @access Public.
 */
router.get("/assignment/:assignmentId", (req, res) => {

    const { assignmentId } = req.params;

    SolutionController
        .getSolutions(assignmentId)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route PUT api/solution/{id}
 * @desc Grade a solution.
 * @access Private.
 */
router.put("/:id", authInstructor, (req, res) => {

    SolutionController
        .gradeSolution(req.params.id, req.body.marks)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

module.exports = router;