const express = require('express');
const router = express.Router();
const authInstructor = require("../middleware/authentication.instructor");
const authAdmin = require("../middleware/authentication.admin");
const CourseController = require('../controller/controller.course');
const InstructorController = require("../controller/controller.instructor");

/**
 * @desc Retrieve all courses.
 * @route GET /api/course
 * @access Public
 */
router.get('/', (req, res) => {

    CourseController
        .getAllCourses()
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @desc Retrieve joined courses for a student.
 * @route GET /api/course/joined/{studentId}
 * @access Public
 */
router.get('/joined/:studentId', (req, res) => {

    const { studentId } = req.params;

    CourseController
        .getJoinedCourses(studentId)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @desc Retrieve accepted courses.
 * @route GET /api/course/accepted
 * @access Public
 */
router.get('/accepted', (req, res) => {

    CourseController
        .getAcceptedCourses()
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @desc Retrieve courses from given instructor ID.
 * @route GET /api/course/instructor/{instructorId}
 * @access Public
 */
router.get('/instructor/:id', (req, res) => {

    CourseController
        .getCoursesByInstructor(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @desc Retrieve courses from given ID.
 * @route GET /api/course/{id}
 * @access Public
 */
router.get('/:id', (req, res) => {

    CourseController
        .getCourseById(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @desc Retrieve courses from given code.
 * @route GET /api/course/code/{code}
 * @access Public
 */
router.get('/code/:code', (req, res) => {

    CourseController
        .getCourseByCode(req.params.code)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err));

});

/**
 * @desc Accept the course.
 * @route PUT /api/course/accept/{id}
 * @access Private
 */
router.put('/accept/:id', authInstructor, (req, res) => {

    CourseController
        .acceptCourse(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err))

});

/**
 * @desc Reject the course.
 * @route PUT /api/course/accept/{id}
 * @access Private
 */
router.put('/reject/:id', authInstructor, (req, res) => {

    CourseController
        .rejectCourse(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err))

});

/**
 * @desc Add a student to the course.
 * @route PUT /api/course/{courseId}/student/{studentId}/join
 * @access Private
 */
router.put('/:courseId/student/:studentId/join', (req, res) => {

    const { courseId, studentId } = req.params;

    CourseController
        .addStudent(courseId, studentId)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err))

});

/**
 * @desc Remove a student from the course.
 * @route PUT /api/course/{courseId}/student/{studentId}/join
 * @access Private
 */
router.put('/:courseId/student/:studentId/leave', (req, res) => {

    const { courseId, studentId } = req.params;

    CourseController
        .removeStudent(courseId, studentId)
        .then(result => res.json(result))
        .catch(err => res.status(err.status).json(err))

});

/**
 * @desc Add a new course.
 * @route POST /api/course
 * @access Private
 */
router.post('/', authAdmin, (req, res) => {

    InstructorController
        .getInstructorById(req.body.instructor)
        .then(result => {
            const { instructor } = result;
            CourseController
                .createCourse(req.body, instructor)
                .then( result => res.json(result))
                .catch(err => res.status(err.status).json(err));
        })
        .catch(err => res.status(err.status).json(err))

});

/**
 * @desc Change course instructor.
 * @route PUT /api/course/{id}/instructor
 * @access Private
 */
router.put('/:id/instructor', authAdmin, (req, res) => {

    InstructorController
        .getInstructorById(req.body.instructor)
        .then(result => {
            const { instructor } = result;
            CourseController
                .replaceInstructor(req.params.id, instructor)
                .then(result => res.json(result))
                .catch(err => res.status(err.status).json(err))
        })
        .catch(err => res.status(err.status).json(err))


});

module.exports = router;