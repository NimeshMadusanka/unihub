import React, { Component } from "react";
import { Button, Col, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row } from "reactstrap";
import Alert from "./Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

class StudentCoursesEnrolledItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: this.props.course._id,
            name: this.props.course.name,
            code: this.props.course.code,
            students: this.props.course.students,
            instructor: this.props.course.instructor,
            status: this.props.course.status,
            index: null,
            alert: false,
            alertText: null
        };
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        }, () => this.props.reload());
    };

    handleSubmit = event => {

        event.preventDefault();

        const packet = {
            method: "PUT",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "x-authorize-token": this.props.session.token,
                "x-authorize-type": this.props.session.type
            }
        };

        fetch(`/api/course/${this.state._id}/student/${this.props.session.user._id}/leave`, packet)
            .then(result => result.json())
            .then(data => {
                data.success
                    ? this.setState({ alert: true, alertText: data.success })
                    : this.setState({ alert: true, alertText: data.msg });
                return data;
            })
            .then(() => {
                fetch(`/api/course/${this.state._id}`)
                    .then(response => response.json())
                    .then(result => this.setState({
                        _id: result.course._id,
                        name: result.course.name,
                        code: result.course.code,
                        students: result.course.students,
                        instructor: result.course.instructor
                    }))
                    .catch(err => console.log(err));
            })
            .catch(err => console.error(err));

    };

    render() {

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        let button;

        button = <form onSubmit={this.handleSubmit}>
            <Button type="submit" className="button mt-4"><FontAwesomeIcon icon={faMinusCircle}/>&ensp;Leave</Button>
        </form>;

        return <React.Fragment>
            <ListGroupItem className="text-left">
                <Row>
                    <Col md={6}>
                        <Link to={{pathname: '/student/course', state: {course: this.props.course}}}>
                            <ListGroupItemHeading>{this.state.name}</ListGroupItemHeading>
                        </Link>
                        <ListGroupItemText className="text-muted mt-2 my-0">Code : {this.state.code}</ListGroupItemText>
                        <ListGroupItemText className="text-muted my-0">Instructor : {this.state.instructor.name}</ListGroupItemText>
                        <ListGroupItemText className="text-muted my-0">No. of Students
                            : {this.state.students.length}</ListGroupItemText>
                    </Col>
                    <Col md={6} className="text-right">
                        {button}
                    </Col>
                </Row>
            </ListGroupItem>
            {alert}
        </React.Fragment>;

    }

}

export default StudentCoursesEnrolledItem;