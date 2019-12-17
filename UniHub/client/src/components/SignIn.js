import React, { Component } from "react";
import { Button, Card, CardBody, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faGraduationCap, faKey, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import Alert from "./Alert";

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        document.title = "UniHub | Sign In";
    }

    resetAlert = () => {
      this.setState({
          alert: false,
          alertText: null
      });
    };

    handleSubmit = event => {
        event.preventDefault();
        fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state)
        })
            .then(result => result.json())
            .then(session => {
                if (session.msg) {
                    this.setState({
                        alert: true,
                        alertText: session.msg
                    })
                } else {
                    this.props.login(session);
                }
            })
            .catch(err => console.log(err));
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {

        if (this.props.session.isAuthenticated) return <Redirect to="/"/>;

        let alert = "";
        if (this.state.alert)
             alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        return <div className="container-fluid row p-5 my-5 mx-0">
            <div className="col-md-4 h-25"/>
            <Card className="loginCard col-md-4 text-center p-3 pt-4">
                <h1 style={{ fontSize: "5rem" }}>UniHub&nbsp;<FontAwesomeIcon
                    style={{ transform: "scale(-1, 1)", color: "rgba(0, 128, 0, 1)" }} icon={faGraduationCap}/></h1>
                <form onSubmit={this.handleSubmit}>
                    <CardBody>
                        <InputGroup className="my-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText className="adTextBox">
                                    <FontAwesomeIcon icon={faEnvelope}/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input autoComplete="off" value={this.state.email} onChange={this.handleChange}
                                   className="textBox"
                                   type="email" name="email" placeholder="E-Mail"/>
                        </InputGroup>
                        <InputGroup className="my-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText className="adTextBox">
                                    <FontAwesomeIcon icon={faKey}/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input value={this.state.password} onChange={this.handleChange} className="textBox"
                                   type="password" name="password"
                                   placeholder="Password"/>
                        </InputGroup>
                        <Button className="button my-3"><FontAwesomeIcon icon={faSignInAlt}/>&ensp;Sign In</Button>
                    </CardBody>
                </form>
            </Card>
            <div className="col-md-4 h-25"/>
            {alert}
        </div>;

    }

}

export default SignIn;