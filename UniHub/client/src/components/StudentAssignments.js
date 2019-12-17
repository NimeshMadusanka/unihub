import React, { Component } from "react";
import StudentAssignmentItem from "./StudentAssignmentItem";
import { Spinner } from "reactstrap";
import { ListGroup } from "reactstrap";

class StudentAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: []
        };
    }

    componentDidMount() {
        fetch(`/api/assignment/course/${this.props.course._id}`)
            .then(response => response.json())
            .then(result => {
                result.assignments.length > 0
                    ? this.setState({ assignments: result.assignments })
                    : this.setState({ assignments: null });
            })
            .catch(err => console.log(err));
    }

    componentWillReceiveProps(nextProps, nextContext) {
        fetch(`/api/assignment/course/${nextProps.course._id}`)
            .then(response => response.json())
            .then(result => {
                result.assignments.length > 0
                    ? this.setState({ assignments: result.assignments })
                    : this.setState({ assignments: null });
            })
            .catch(err => console.log(err));
    }

    reload = () => {
        this.setState({ assignments: [] }, () => {
            fetch(`/api/assignment/course/${this.props.course._id}`)
                .then(response => response.json())
                .then(result => {
                    result.assignments.length >= 1
                        ? this.setState({ assignments: result.assignments })
                        : this.setState({ assignments: null });
                })
                .catch(err => console.log(err));
        });
    };

    render() {

        let assignments;

        if (this.state.assignments === null) {

            assignments = <div className="mt-4 text-success text-center">
                <span style={{ fontSize: "2rem" }}>No Assignments</span>
            </div>;

        } else if (this.state.assignments.length > 0) {

            assignments = this.state.assignments.map(assignment =>
                <StudentAssignmentItem
                    key={assignment._id}
                    reload={this.reload}
                    course={this.props.course}
                    session={this.props.session}
                    assignment={assignment}/>
            );

        } else {

            assignments = <div className="mt-4 text-success text-center">
                <span style={{ fontSize: "2rem" }}>Loading</span>&emsp;
                <Spinner size="lg"/>
            </div>;

        }

        return <React.Fragment>
            <ListGroup>
                {assignments}
            </ListGroup>
        </React.Fragment>;

    }

}

export default StudentAssignments;