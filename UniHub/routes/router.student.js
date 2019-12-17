const express = require("express");
const authStudent = require("../middleware/authentication.student");
const validation = require("../middleware/validation");
const StudentController = require("../controller/controller.student");

const router = express.Router();

/**
 * @route GET api/student
 * @desc Retrieve all students.
 * @access Public.
 */
router.get("/", (req, res) => {

    StudentController
        .getAllStudents()
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route GET api/student/:id
 * @desc Retrieve a specific student from the given ID.
 * @access Public
 */
router.get("/:id", (req, res) => {

    StudentController
        .getStudentById(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route GET api/students/email/:email
 * @desc Retrieve a specific student from the given email.
 * @access Public
 */
router.get("/email/:email", (req, res) => {

    StudentController
        .getStudentByEmail(req.params.email)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route POST api/students
 * @desc Create a new student.
 * @access Public
 */
router.post("/", validation, (req, res) => {

    StudentController
        .createStudent(req.body)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route PUT api/students/:id
 * @desc Update a existing student from the given ID.
 * @access Private
 */
router.put("/:id", authStudent, validation, (req, res) => {

    StudentController
        .updateStudentById(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route DELETE api/students/:id
 * @desc Delete a existing student from the given email.
 * @access Private
 */
router.delete("/:id", authStudent, (req, res) => {

    StudentController
        .deleteStudentById(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});


module.exports = router;
