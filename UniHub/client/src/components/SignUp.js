import React, { Component } from "react";
import {
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Button,
    FormGroup,
    FormText
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faUser,
    faKey,
    faPhone,
    faUserPlus,
    faLock
} from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import Alert from "./Alert";


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            telephone: "",
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        document.title = "UniHub | Sign Up";
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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
                telephone: this.state.telephone
            })
        };

        fetch("/api/student", packet)
            .then(result => result.json())
            .then(data => {
                data.success
                    ? this.setState({ alert: true, alertText: data.success })
                    : this.setState({ alert: true, alertText: data.msg });
                return data;
            })
            .then(data => {
                setTimeout(() => {
                    this.props.login({
                        isAuthenticated: true,
                        user: data.student,
                        token: data.token,
                        type: data.type
                    });
                }, 2000);
            })
            .catch(err => console.error(err));
    };

    render() {

        if (this.props.session.isAuthenticated) return <Redirect to="/"/>;

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        return (
            <div className="container-fluid row mx-0">
                <Col md={6} className="container-fluid text-center">
          <span>
            <h1 className="mt-4 mb-4 text-success">
              <FontAwesomeIcon icon={faLock}/>
                &ensp;Privacy Notice
            </h1>
            <hr/>
            <p style={{ textAlign: "start" }}>
              This privacy notice discloses the privacy practices for KEVIN
              FASHIONS. This privacy notice applies solely to information
              collected by this website. It will notify you of the following:
            </p>
            <ul style={{ padding: "0 2rem", textAlign: "start" }}>
              <li>
                What personally identifiable information is collected from you
                through the website, how it is used and with whom it may be
                shared.
                <br/>
                <br/>
              </li>
              <li>
                What choices are available to you regarding the use of your
                data.
                <br/>
                <br/>
              </li>
              <li>
                The security procedures in place to protect the misuse of your
                information.
                <br/>
                <br/>
              </li>
              <li>How you can correct any inaccuracies in the information.</li>
            </ul>
            <h3 style={{ textAlign: "start" }}>
              Information Collection, Use, and Sharing
            </h3>
            <p style={{ textAlign: "start" }}>
              We are the sole owners of the information collected on this site.
              We only have access to/collect information that you voluntarily
              give us via email or other direct contact from you. We will not
              sell or rent this information to anyone.
              <br/> <br/> We will use your information to respond to you,
              regarding the reason you contacted us. We will not share your
              information with any third party outside of our organization,
              other than as necessary to fulfill your request, e.g. to ship an
              order.
              <br/>
            </p>
          </span>
                </Col>
                <Col md={6} className="container-fluid text-center">
                    <h1 className="mt-4 mb-4 text-success">Sign Up</h1>
                    <hr/>
                    <form onSubmit={this.handleSubmit}>
                        <div className="mr-0">
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-4">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faUser}/>
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
                                <Col md={6} className="mb-4">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faKey}/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            required
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            className="textBox"
                                            type="password"
                                            name="password"
                                            placeholder="New Password"
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faKey}/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            required
                                            value={this.state.confirmPassword}
                                            onChange={this.handleChange}
                                            className="textBox"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
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
                                        &ensp;Register
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

export default SignUp;
