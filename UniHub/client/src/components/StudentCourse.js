import React, { Component } from "react";
import {
    Col,
    Row
} from "reactstrap";
import { Redirect } from "react-router-dom";
import Alert from "./Alert";
import StudentAssignments from "./StudentAssignments";

class StudentCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.location.state.course,
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        document.title = `UniHub | ${this.state.course.name}`;
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        });
    };

    render() {

        if (!this.props.session.isAuthenticated || this.props.session.type !== "student") return <Redirect to="/"/>;

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        return (
            <div className="container-fluid mx-0">
                <Row>
                    <Col md={12} className="container-fluid text-center">
                        <h1 className="mt-4 mb-2 text-success">{this.state.course.name}</h1>
                        <h4 className="text-muted">{this.state.course.code}</h4>
                        <p className="text-muted">Conducted by - {this.state.course.instructor.name}</p>
                        <hr/>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="container-fluid text-center">
                        <StudentAssignments key={this.state.course._id} course={this.state.course} session={this.props.session}/>
                    </Col>
                </Row>
                {alert}
            </div>
        );
    }
}

export default StudentCourse;
