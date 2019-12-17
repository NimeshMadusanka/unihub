import React, { Component } from "react";
import { Jumbotron, Container } from "reactstrap";

class NotFound extends Component {

    componentDidMount() {
        document.title = "UniHub | 404 Not Found"
    }

    render() {
        return <div className="container-fluid px-0">
            <Jumbotron fluid>
                <Container fluid className="text-danger">
                    <h1 className="display-3">404</h1>
                    <p className="lead ml-3">Not Found</p>
                </Container>
            </Jumbotron>
        </div>;
    }

}

export default NotFound;