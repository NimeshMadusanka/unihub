import React, { Component } from "react";
import {
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    Button,
    FormGroup,
    FormText,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Spinner
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faUserSecret,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import Alert from "./Alert";


class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            admins: [],
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        document.title = "UniHub | Admin";
        fetch('/api/admin')
            .then(response => response.json())
            .then(result => this.setState({admins: result.admins}))
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
                email: this.state.email
            })
        };

        fetch("/api/admin", packet)
            .then(result => result.json())
            .then(data => {
                data.success
                    ? this.setState({ alert: true, alertText: data.success })
                    : this.setState({ alert: true, alertText: data.msg });
                fetch('/api/admin')
                    .then(response => response.json())
                    .then(result => this.setState({admins: result.admins}))
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

        let admins;
        if (this.state.admins.length > 0) {
            admins = this.state.admins.map(admin =>
                <ListGroupItem key={admin._id} className="text-left">
                    <ListGroupItemHeading>{admin.name}</ListGroupItemHeading>
                    <ListGroupItemText className="text-muted">{admin.email}</ListGroupItemText>
                </ListGroupItem>
            );
        } else {
            admins = <div className="mt-4 text-success">
                <span style={{fontSize: '2rem'}}>Loading</span>&emsp;
                <Spinner size="lg"/>
            </div>;
        }

        return (
            <div className="container-fluid row mx-0">
                <Col md={6} className="container-fluid text-center">
                    <h1 className="mt-4 mb-4 text-success">Admins</h1>
                    <hr/>
                    <ListGroup>
                        {admins}
                    </ListGroup>
                </Col>
                <Col md={6} className="container-fluid text-center">
                    <h1 className="mt-4 mb-4 text-success">Add New Admin</h1>
                    <hr/>
                    <form onSubmit={this.handleSubmit}>
                        <div className="mr-0">
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-4">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faUserSecret}/>
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
                                <Col md={12} className="mb-4 text-center">
                                    <Button className="button">
                                        <FontAwesomeIcon icon={faUserPlus}/>
                                        &ensp;Add Admin
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

export default Admin;
