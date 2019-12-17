import React, { Component } from "react";
import AssignmentItem from "./AssignmentItem";
import { Spinner } from "reactstrap";
import ListGroup from "reactstrap/es/ListGroup";
import { Redirect } from "react-router-dom";

class Assignment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignment: {},
            solutions: []
        };
    }

    componentDidMount() {
        this.setState({ assignment: this.props.location.state.assignment }, () => {
            fetch(`/api/solution/assignment/${this.state.assignment._id}`)
                .then(response => response.json())
                .then(result => {
                    result.solutions.length > 0
                        ? this.setState({ solutions: result.solutions })
                        : this.setState({ solutions: null });
                })
                .catch(err => console.log(err));
        });
    }

    reload = () => {
        this.setState({ assignments: [] }, () => {
            fetch(`/api/assignment/${this.state.assignment._id}`)
                .then(response => response.json())
                .then(result => {
                    result.solutions.length > 0
                        ? this.setState({ solutions: result.solutions })
                        : this.setState({ solutions: null });
                })
                .catch(err => console.log(err));
        });
    };

    render() {

        if (!this.props.session.isAuthenticated) return <Redirect to="/"/>;

        let solutions;

        if (this.state.solutions === null) {

            solutions = <div className="mt-4 text-success text-center">
                <span style={{ fontSize: "2rem" }}>No Assignments</span>
            </div>;

        } else if (this.state.solutions.length > 0) {

            solutions = this.state.solutions.map(solution =>
                <AssignmentItem key={solution._id} reload={this.reload} solution={solution} session={this.props.session}/>
            );

        } else {

            solutions = <div className="mt-4 text-success text-center">
                <span style={{ fontSize: "2rem" }}>Loading</span>&emsp;
                <Spinner size="lg"/>
            </div>;

        }

        return <React.Fragment>
            <h1 className="mt-4 mb-4 text-success text-center">Solutions</h1>
            <hr/>
            <ListGroup>
                <div className="container-fluid">
                    {solutions}
                </div>
            </ListGroup>
        </React.Fragment>;

    }

}

export default Assignment;