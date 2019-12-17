const express = require("express");
const router = express.Router();
const validation = require("../middleware/validation");
const authInstructor = require("../middleware/authentication.instructor");
const authAdmin = require("../middleware/authentication.admin");
const InstructorController = require("../controller/controller.instructor");

/**
 * @route GET api/instructor
 * @desc Retrieve all instructors.
 * @access Public.
 */
router.get('/', (req, res) => {

    InstructorController
        .getAllInstructors()
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route POST api/instructor
 * @desc Create a new instructor.
 * @access Private.
 */
router.post('/', authAdmin, (req, res) => {

    InstructorController
        .createInstructor(req.body)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route GET api/instructor/{id}
 * @desc Retrieve instructor from given ID.
 * @access Public.
 */
router.get('/:id', (req, res) => {

    InstructorController
        .getInstructorById(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route GET api/instructor/{email}
 * @desc Retrieve instructor from given email.
 * @access Public.
 */
router.get('/:email', (req, res) => {

    InstructorController
        .getInstructorByEmail(req.params.email)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @route PUT api/instructor
 * @desc Update an instructor from given ID.
 * @access Private.
 */
router.put('/:id', authInstructor, validation, (req, res) => {

    InstructorController
        .updateInstructorById(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err))

});

/**
 * @route DELETE api/instructor
 * @desc Delete an instructor from given ID.
 * @access Private.
 */
router.delete('/:id', authInstructor, (req, res) => {

    InstructorController
        .deleteInstructorById(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err))

});

module.exports = router;