import React, { Component } from "react";
import { Button, ButtonGroup, Col, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row } from "reactstrap";
import Alert from "./Alert";
import { Link } from "react-router-dom";

class InstructorCourseItem extends Component {

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
            },
            body: JSON.stringify({
                status: this.state.status
            })
        };

        if (this.state.index === true) {

            fetch(`/api/course/accept/${this.state._id}`, packet)
                .then(result => result.json())
                .then(data => {
                    data.success
                        ? this.setState({ alert: true, alertText: data.success })
                        : this.setState({ alert: true, alertText: data.msg });
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
                    return data;
                })
                .catch(err => console.error(err));

        } else {

            fetch(`/api/course/reject/${this.state._id}`, packet)
                .then(result => result.json())
                .then(data => {
                    data.success
                        ? this.setState({ alert: true, alertText: data.success })
                        : this.setState({ alert: true, alertText: data.msg });
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
                    return data;
                })
                .catch(err => console.error(err));

        }

    };

    render() {

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        let status, buttons, heading = <ListGroupItemHeading>{this.state.name}</ListGroupItemHeading>;

        if (this.state.status === "pending") {
            status = <span className="text-warning">{this.state.status.toUpperCase()}</span>;
            buttons = <form onSubmit={this.handleSubmit}>
                <ButtonGroup className="mt-3">
                    <Button type="submit" onClick={() => this.setState({ index: true })}
                            className="button">Accept</Button>
                    <Button type="submit" onClick={() => this.setState({ index: false })}
                            className="button">Reject</Button>
                </ButtonGroup>
            </form>;

        } else if (this.state.status === "accepted") {
            status = <span className="text-success">{this.state.status.toUpperCase()}</span>;
            heading = <Link to={{ pathname: "/instructor/course", state: { course: this.props.course } }}>
                <ListGroupItemHeading>{this.state.name}</ListGroupItemHeading>
            </Link>;
        } else {
            status = <span className="text-danger">{this.state.status.toUpperCase()}</span>;
        }


        return <React.Fragment>
            <ListGroupItem className="text-left">
                <Row>
                    <Col md={6}>
                        {heading}
                        <ListGroupItemText className="text-muted mt-2 my-0">Code : {this.state.code}</ListGroupItemText>
                        <ListGroupItemText className="text-muted my-0">Status : {status}</ListGroupItemText>
                        <ListGroupItemText className="text-muted my-0">No. of Students
                            : {this.state.students.length}</ListGroupItemText>
                    </Col>
                    <Col md={6} className="text-right">
                        {buttons}
                    </Col>
                </Row>
            </ListGroupItem>
            {alert}
        </React.Fragment>;

    }

}

export default InstructorCourseItem;