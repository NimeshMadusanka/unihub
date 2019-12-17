import React, { Component } from "react";
import {
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Button,
    FormGroup,
    FormText, ListGroupItem, ListGroupItemHeading, ListGroupItemText, ListGroup, Row
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserTie,
    faUserCog
} from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";


class CourseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            instructor: "",
            instructors: [],
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        this.setState({
            instructors: this.props.instructors
        }, () => this.setState({ instructor: this.state.instructors[0] }));
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
                instructor: this.state.instructor
            })
        };

        fetch(`/api/course/${this.props.course._id}/instructor`, packet)
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

        let instructors = this.state.instructors.map(instructor => {
            return <option key={instructor._id} value={instructor._id}>{instructor.name}</option>;
        });

        let replace = <React.Fragment>
            <form onSubmit={this.handleSubmit}>
                <Row className="mx-0 mt-md-0 mt-3">
                    <Col md={12} className="mx-0 text-center">
                        <FormGroup className="mx-0 text-left">
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText className="m-0 adTextBox">
                                        <FontAwesomeIcon icon={faUserTie}/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    value={this.state.instructor}
                                    onChange={this.handleChange}
                                    className="m-0 select"
                                    type="select"
                                    name="instructor"
                                >
                                    {instructors}
                                </Input>
                            </InputGroup>
                            <FormText className="ml-3 my-0">Please select an instructor.</FormText>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="mx-0">
                    <Col md={12} className="text-right">
                        <Button className="mb-md-1 mb-3 mt-0 button">
                            <FontAwesomeIcon icon={faUserCog}/>
                            &ensp;Assign
                        </Button>
                    </Col>
                </Row>
            </form>
        </React.Fragment>;

        let status;

        if (this.props.course.status === "pending") {
            status = <span className="text-warning">{this.props.course.status.toUpperCase()}</span>;
            replace = null;
        } else if (this.props.course.status === "accepted") {
            status = <span className="text-success">{this.props.course.status.toUpperCase()}</span>;
            replace = null;
        } else {
            status = <span className="text-danger">{this.props.course.status.toUpperCase()}</span>;
        }

        let course = <ListGroupItem key={this.props.course._id} className="text-left">
            <Row>
                <Col md={5}>
                    <ListGroupItemHeading>{this.props.course.name}</ListGroupItemHeading>
                    <ListGroupItemText className="text-muted mt-2 my-0">Code
                        : {this.props.course.code}</ListGroupItemText>
                    <ListGroupItemText className="text-muted my-0">Instructor
                        : {this.props.course.instructor.name}</ListGroupItemText>
                    <ListGroupItemText className="text-muted my-0">Status : {status}</ListGroupItemText>
                </Col>
                <Col md={7}>
                    {replace}
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

export default CourseItem;
