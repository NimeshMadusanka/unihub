const express = require("express");
const fileUpload = require("express-fileupload");
const authInstructor = require("../middleware/authentication.instructor");
const AssignmentController = require("../controller/controller.assignment");

const router = express.Router();

router.use(fileUpload({ createParentPath: true }));

/**
 * @route POST api/assignment
 * @desc Create a new assignment.
 * @access Private.
 */
router.post("/", authInstructor, (req, res) => {

    const { files } = req;

    if (files === null) {

        return res.status(400).json({ msg: "No file uploaded" });

    } else {

        files.file.name = Date.now() + files.file.name;

        AssignmentController
            .createAssignment(files.file, req.body)
            .then(result => res.json(result))
            .catch(err => res.status(err.status).json(err));

    }

});

/**
 * @route GET api/assignment/course/{id}
 * @desc Get assignments of a course.
 * @access Public.
 */
router.get("/course/:id", (req, res) => {

    AssignmentController
        .getAssignments(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route PUT api/assignment/{id}
 * @desc Change deadline.
 * @access Public.
 */
router.put("/:id", authInstructor, (req, res) => {

    AssignmentController
        .changeDeadline(req.params.id, req.body.deadline, req.body.currentDeadline)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

module.exports = router;