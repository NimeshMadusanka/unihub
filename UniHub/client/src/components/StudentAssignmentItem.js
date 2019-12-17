import React, { Component } from "react";
import {
    Col,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Row
} from "reactstrap";
import Alert from "./Alert";
import { Link } from "react-router-dom";
import AddSolution from "./AddSolution";


class StudentAssignmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solution: null,
            deadline: "",
            assignment: {},
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        this.setState({
            assignment: this.props.assignment
        }, () => {
            fetch(`/api/solution/assignment/${this.state.assignment._id}/course/${this.props.course._id}/student/${this.props.session.user._id}`)
                .then(response => response.json())
                .then(result =>
                    result.solution
                        ? this.setState({ solution: result.solution })
                        : this.setState({ solution: null })
                )
                .catch(err => console.error(err));
        });
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        });
    };

    render() {

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        let solution, marks;
        if (this.state.solution != null) {

            if (!this.state.solution.marks) {
                marks = <React.Fragment>
                    <ListGroupItemText
                        className="text-muted mt-2 my-0">Not graded yet.</ListGroupItemText>
                </React.Fragment>;
            } else {
                marks = <React.Fragment>
                    <ListGroupItemText
                        className="text-danger mt-2 my-0">Marks: {this.state.solution.marks}</ListGroupItemText>
                </React.Fragment>;
            }

            solution = <React.Fragment>
                <ListGroupItemHeading>Solution</ListGroupItemHeading>
                <ListGroupItemText
                    className="text-muted mt-2 my-0">Submitted: {this.state.solution.submitDate}</ListGroupItemText>
                {marks}
                <ListGroupItemText className="text-muted mt-2 my-0">
                    <Link to={{ pathname: this.state.solution.attachment }} target="_blank">Download</Link>
                </ListGroupItemText>
            </React.Fragment>;
        }

        let course = <ListGroupItem key={this.state.assignment._id} className="text-left">
            <Row>
                <Col md={4} className="my-3 my-md-0">
                    <ListGroupItemHeading>{this.state.assignment.name}</ListGroupItemHeading>
                    <ListGroupItemText
                        className="text-muted mt-2 my-0">Deadline: {this.state.assignment.deadline}</ListGroupItemText>
                    <ListGroupItemText className="text-muted mt-2 my-0">
                        <Link to={{ pathname: this.state.assignment.attachment }} target="_blank">Download</Link>
                    </ListGroupItemText>
                </Col>
                <Col md={4} className="my-3 my-md-0">
                    {solution}
                </Col>
                <Col md={4} className="my-3 my-md-0">
                    <AddSolution
                        key={this.state.assignment._id}
                        session={this.props.session}
                        course={this.props.course}
                        assignment={this.state.assignment}
                        reload={this.props.reload}
                    />
                </Col>
            </Row>
        </ListGroupItem>;


        return (
            <React.Fragment>
                {course}
                {alert}
            </React.Fragment>
        );
    }
}

export default StudentAssignmentItem;
