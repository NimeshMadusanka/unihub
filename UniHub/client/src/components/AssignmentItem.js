import React, { Component } from "react";
import {
    Button,
    FormGroup,
    FormText,
    Input,
    InputGroup, InputGroupAddon, InputGroupText,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText
} from "reactstrap";
import Alert from "./Alert";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercentage, faCheck } from "@fortawesome/free-solid-svg-icons";


class AssignmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marks: "",
            student: {},
            solution: this.props.solution,
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        fetch(`/api/student/${this.state.solution.student}`)
            .then(response => response.json())
            .then(result => this.setState({ student: result.student }))
            .catch(err => console.log(err));
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
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
                marks: this.state.marks
            })
        };

        fetch(`/api/solution/${this.state.solution._id}`, packet)
            .then(result => result.json())
            .then(data => {
                data.success
                    ? this.setState({ alert: true, alertText: data.success, solution: data.solution })
                    : this.setState({ alert: true, alertText: data.msg });
                return data;
            })
            .catch(err => console.error(err));
    };

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

        let marks;
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

        let solution;
        solution = <React.Fragment>
            <ListGroupItem className="text-left">
                <Row>
                    <Col md={8}>
                        <ListGroupItemHeading>{this.state.student.name}</ListGroupItemHeading>
                        <ListGroupItemText
                            className="text-muted mt-2 my-0">{this.state.student.email}</ListGroupItemText>
                        <hr/>
                        <ListGroupItemText
                            className="text-muted mt-2 my-0">Submitted: {this.state.solution.submitDate}</ListGroupItemText>
                        {marks}
                        <ListGroupItemText className="text-muted mt-2 my-0">
                            <Link to={{ pathname: this.state.solution.attachment }} target="_blank">Download</Link>
                        </ListGroupItemText>
                    </Col>
                    <Col md={4} className="text-right">
                        <form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col md={12}>
                                    <FormGroup className="mt-3 text-left">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className="adTextBox">
                                                    <FontAwesomeIcon icon={faPercentage}/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                autoComplete="off"
                                                required
                                                value={this.state.marks}
                                                onChange={this.handleChange}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                className="textBox"
                                                name="marks"
                                                placeholder="Marks"
                                            />
                                        </InputGroup>
                                        <FormText className="ml-3">Marks should be between 0 and 100.</FormText>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Button className="my-0 button">
                                        <FontAwesomeIcon icon={faCheck}/>
                                        &ensp;Grade
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </ListGroupItem>
        </React.Fragment>;


        return (
            <React.Fragment>
                {solution}
                {alert}
            </React.Fragment>
        );
    }
}

export default AssignmentItem;
