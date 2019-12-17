import React, { Component } from "react";
import {
    Col, Spinner, ListGroup
} from "reactstrap";
import { Redirect } from "react-router-dom";
import Alert from "./Alert";
import StudentCoursesEnrolledItem from "./StudentCoursesEnrolledItem";

class StudentCoursesEnrolled extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        document.title = "UniHub | Joined Courses";

        fetch(`/api/course/joined/${this.props.session.user._id}`)
            .then(response => response.json())
            .then(result => {
                result.courses.length > 0
                    ? this.setState({ courses: result.courses })
                    : this.setState({ courses: null });
            })
            .catch(err => console.log(err));
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        });
    };

    reload = () => {
        this.setState({ courses: [] }, () => {
            fetch(`/api/course/joined/${this.props.session.user._id}`)
                .then(response => response.json())
                .then(result => {
                    result.courses.length > 0
                        ? this.setState({ courses: result.courses })
                        : this.setState({ courses: null });
                })
                .catch(err => console.log(err));
        });
    };

    render() {

        if (!this.props.session.isAuthenticated || this.props.session.type !== "student") return <Redirect to="/"/>;

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        let courses;
        if (this.state.courses === null) {
            courses = <div className="mt-4 text-success">
                <span style={{ fontSize: "2rem" }}>No Courses</span>
            </div>;
        } else if (this.state.courses.length > 0) {
            courses = this.state.courses.map(course =>
                <StudentCoursesEnrolledItem
                    key={course._id}
                    session={this.props.session}
                    course={course}
                    reload={this.reload}
                />);
        } else {
            courses = <div className="mt-4 text-success">
                <span style={{ fontSize: "2rem" }}>Loading</span>&emsp;
                <Spinner size="lg"/>
            </div>;
        }

        return (
            <div className="container-fluid row mx-0">
                <Col md={12} className="container-fluid text-center">
                    <h1 className="mt-4 mb-4 text-success">Courses</h1>
                    <hr/>
                    <ListGroup>
                        {courses}
                    </ListGroup>
                </Col>
                {alert}
            </div>
        );
    }
}

export default StudentCoursesEnrolled;
