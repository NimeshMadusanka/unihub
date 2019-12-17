import React, {Component} from 'react';
import {Jumbotron, Button} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGraduationCap} from "@fortawesome/free-solid-svg-icons";

class Home extends Component {

    componentDidMount() {
        document.title = "UniHub | Home"
    }

    render() {

        return <div className="container-fluid px-0">
            <Jumbotron className="header">
                <h1 className="display-3" style={{fontSize: '5rem'}}>UniHub&nbsp;<FontAwesomeIcon style={{transform: 'scale(-1, 1)', color:  'rgba(0, 128, 0, 1)'}} icon={faGraduationCap}/></h1>
                <p className="lead">Your path to greatness starts here.</p>
                <hr className="my-2" />
                <p>The student, instructor information system.</p>
                <p className="lead">
                    <Button className="button" color="primary">Learn More</Button>
                </p>
            </Jumbotron>
        </div>;

    }

}

export default Home;