import React, { Component } from "react";
import {
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Button,
    FormGroup,
    FormText, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Spinner, ListGroup
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faUserTie,
    faUserPlus,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import Alert from "./Alert";


class Instructor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            telephone: "",
            instructors: [],
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        document.title = "UniHub | Instructor";
        fetch('/api/instructor')
            .then(response => response.json())
            .then(result => {
                this.setState({instructors: result.instructors})
            })
            .catch(err => console.log(err));
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        });
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {

        event.preventDefault();

        const packet = {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "x-authorize-token": this.props.session.token,
                "x-authorize-type": this.props.session.type
            },
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                telephone: this.state.telephone
            })
        };

        fetch("/api/instructor", packet)
            .then(result => result.json())
            .then(data => {
                data.success
                    ? this.setState({ alert: true, alertText: data.success })
                    : this.setState({ alert: true, alertText: data.msg });
                fetch('/api/instructor')
                    .then(response => response.json())
                    .then(result => {
                        this.setState({instructors: result.instructors})
                    })
                    .catch(err => console.log(err));
                return data;
            })
            .catch(err => console.error(err));
    };

    render() {

        if (!this.props.session.isAuthenticated || this.props.session.type !== 'admin') return <Redirect to="/"/>;

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        let instructors;
        if (this.state.instructors.length > 0) {
            instructors = this.state.instructors.map(instructor =>
                <ListGroupItem key={instructor._id} className="text-left">
                    <ListGroupItemHeading>{instructor.name}</ListGroupItemHeading>
                    <ListGroupItemText className="text-muted mt-2 my-0">Email : {instructor.email}</ListGroupItemText>
                    <ListGroupItemText className="text-muted my-0">Telephone : {instructor.telephone}</ListGroupItemText>
                </ListGroupItem>
            );
        } else {
            instructors = <div className="mt-4 text-success">
                <span style={{fontSize: '2rem'}}>Loading</span>&emsp;
                <Spinner size="lg"/>
            </div>;
        }

        return (
            <div className="container-fluid row mx-0">
                <Col md={6} className="container-fluid text-center">
                    <h1 className="mt-4 mb-4 text-success">Instructors</h1>
                    <hr/>
                    <ListGroup>
                        {instructors}
                    </ListGroup>
                </Col>
                <Col md={6} className="container-fluid text-center">
                    <h1 className="mt-4 mb-4 text-success">Add New Instructor</h1>
                    <hr/>
                    <form onSubmit={this.handleSubmit}>
                        <div className="mr-0">
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-4">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faUserTie}/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            autoComplete="off"
                                            required
                                            value={this.state.name}
                                            onChange={this.handleChange}
                                            className="textBox"
                                            type="text"
                                            name="name"
                                            placeholder="Name"
                                        />
                                    </InputGroup>
                                </Col>
                            </div>
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-0">
                                    <FormGroup className="text-left">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className="adTextBox">
                                                    <FontAwesomeIcon icon={faEnvelope}/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                autoComplete="off"
                                                required
                                                value={this.state.email}
                                                onChange={this.handleChange}
                                                className="textBox"
                                                type="email"
                                                name="email"
                                                placeholder="E-Mail"
                                            />
                                        </InputGroup>
                                        <FormText className="ml-3">Please enter a valid email address.</FormText>
                                    </FormGroup>
                                </Col>
                            </div>
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-0">
                                    <FormGroup className="text-left">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText className="adTextBox">
                                                    <FontAwesomeIcon icon={faPhone}/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                autoComplete="off"
                                                required
                                                value={this.state.telephone}
                                                onChange={this.handleChange}
                                                type="text"
                                                className="textBox"
                                                name="telephone"
                                                placeholder="Telephone"
                                            />
                                        </InputGroup>
                                        <FormText className="ml-3">Telephone number should be 10 digits, starting from
                                            0.</FormText>
                                    </FormGroup>
                                </Col>
                            </div>
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-4 text-center">
                                    <Button className="button">
                                        <FontAwesomeIcon icon={faUserPlus}/>
                                        &ensp;Add Instructor
                                    </Button>
                                </Col>
                            </div>
                        </div>
                    </form>
                </Col>
                {alert}
            </div>
        );
    }
}

export default Instructor;
