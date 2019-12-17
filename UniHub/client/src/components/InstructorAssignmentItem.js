import React, { Component } from "react";
import {
    Col,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    ListGroup,
    Row,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText, Input, FormText
} from "reactstrap";
import Alert from "./Alert";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";


class InstructorAssignmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deadline: '',
            assignment: {},
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        this.setState({
            assignment: this.props.assignment
        });
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        }, () => this.props.reload());
    };

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
                deadline: this.state.deadline,
                currentDeadline: this.state.assignment.deadline
            })
        };

        fetch(`/api/assignment/${this.state.assignment._id}`, packet)
            .then(result => result.json())
            .then(data => {
                data.success
                    ? this.setState({ alert: true, alertText: data.success })
                    : this.setState({ alert: true, alertText: data.msg });
                return data;
            })
            .catch(err => console.error(err));
    };

    render() {

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;


        let course = <ListGroupItem key={this.state.assignment._id} className="text-left">
            <Row>
                <Col md={5} className="my-3 my-md-0">
                    <Link to={{pathname: '/instructor/course/assignment', state: {assignment: this.state.assignment}}}>
                        <ListGroupItemHeading>{this.state.assignment.name}</ListGroupItemHeading></Link>
                    <ListGroupItemText className="text-muted mt-2 my-0">Deadline: {this.state.assignment.deadline}</ListGroupItemText>
                    <ListGroupItemText className="text-muted mt-2 my-0">
                        <Link to={{ pathname: this.state.assignment.attachment }} target="_blank">Download</Link>
                    </ListGroupItemText>
                </Col>
                <Col md={7} className="my-3 my-md-0">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row container-fluid mr-0 pr-0">
                            <Col md={12} className="mb-0">
                                <FormGroup className="text-left">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faCalendarDay}/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            autoComplete="off"
                                            required
                                            value={this.state.deadline}
                                            onChange={this.handleChange}
                                            className="select"
                                            type="date"
                                            name="deadline"
                                            placeholder="Deadline"
                                        />
                                    </InputGroup>
                                    <FormText className="ml-3">Please a date and a time further than current deadline.</FormText>
                                </FormGroup>
                            </Col>
                        </div>
                        <div className="pr-4 pl-3">
                            <div className="text-right">
                                <button
                                    type='submit'
                                    className='mt-0 button'
                                ><FontAwesomeIcon icon={faCalendarDay}/>&ensp;Change Deadline</button>
                            </div>
                        </div>
                    </form>
                </Col>
            </Row>
        </ListGroupItem>;


        return (
            <React.Fragment>
                <ListGroup>
                    {course}
                </ListGroup>
                {alert}
            </React.Fragment>
        );
    }
}

export default InstructorAssignmentItem;
