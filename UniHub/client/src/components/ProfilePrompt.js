import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";

class ProfilePrompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        if (document.getElementById("password")) {
            document.getElementById("currentPassword").addEventListener("change", this.handleChange);
            document.getElementById("password").addEventListener("change", this.handleChange);
            document.getElementById("confirmPassword").addEventListener("change", this.handleChange);
        } else {
            document.getElementById("input").addEventListener("change", this.handleChange);
        }
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        });
        this.props.resetPrompt();
    };

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = () => {
        const packet = {
            method: "PUT",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "x-authorize-token": this.props.token,
                "x-authorize-type": this.props.type
            },
            body: JSON.stringify(this.state)
        };

        fetch(this.props.URI, packet)
            .then(result => result.json())
            .then(data => {
                if (data.success) {
                    this.props.login({
                        isAuthenticated: true,
                        user: data.user,
                        token: this.props.token,
                        type: this.props.type
                    });
                    data.msg = data.success;
                }
                return data;
            })
            .then(data => this.setState({ alert: true, alertText: data.msg }))
            .catch(err => console.error(err));
    };

    render() {
        const { promptText, resetPrompt } = this.props;

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        return (
            <Modal
                centered
                fade={false}
                modalTransition={{ timeout: 1000 }}
                isOpen={this.state.modal}
                toggle={() => {
                    this.toggle();
                    resetPrompt();
                }}
                className="modalPrompt">
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                        resetPrompt();
                    }}
                    charCode="⨉">
                    <div className="navbar-brand">
                        UniHub&ensp;
                        <FontAwesomeIcon
                            style={{ transform: "scale(-1, 1)", color: "rgba(0, 128, 0, 1)" }}
                            icon={faGraduationCap}
                        />
                    </div>
                </ModalHeader>
                <ModalBody>{promptText}</ModalBody>
                <ModalFooter>
                    <Button onClick={this.handleSubmit} className="button my-0 py-1">
                        Update
                    </Button>
                    &emsp;
                    <Button
                        className="button my-0 py-1"
                        onClick={() => {
                            this.toggle();
                            resetPrompt();
                        }}>
                        Cancel
                    </Button>
                </ModalFooter>
                {alert}
            </Modal>
        );
    }
}

export default ProfilePrompt;
