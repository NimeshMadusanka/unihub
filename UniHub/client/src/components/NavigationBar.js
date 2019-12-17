import React, { Component } from "react";
import { NavLink as Link } from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserPlus,
    faSignInAlt,
    faSignOutAlt,
    faGraduationCap,
    faUserGraduate,
    faUserTie,
    faUserSecret,
    faBook,
    faBell,
    faStream
} from "@fortawesome/free-solid-svg-icons";

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggle = () => this.setState({ isOpen: !this.state.isOpen });

    render() {
        const { isAuthenticated, user, type } = this.props.session;

        let auth, icon, username, drop;

        if (type === "student") {
            icon = <FontAwesomeIcon icon={faUserGraduate}/>;
            username = user.name;
        } else if (type === "instructor") {
            icon = <FontAwesomeIcon icon={faUserTie}/>;
            username = user.name;
        } else if (type === "admin") {
            username = user.name;
            icon = <FontAwesomeIcon icon={faUserSecret}/>;
        }

        if (!isAuthenticated) {
            auth = (
                <React.Fragment>
                    <NavItem>
                        <Link
                            to="/login"
                            activeClassName="active"
                            className="nav-link mx-2">
                            <FontAwesomeIcon icon={faSignInAlt}/>
                            &ensp;Sign In
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/register" className="nav-link mx-2">
                            <FontAwesomeIcon icon={faUserPlus}/>
                            &ensp;Sign Up
                        </Link>
                    </NavItem>
                </React.Fragment>
            );

            drop = "";

        } else if (isAuthenticated) {
            auth = (
                <React.Fragment>
                    <NavItem>
                        <Link to="/profile" className="nav-link mx-2">
                            <span className="text-success">{icon}&ensp;
                                {type.toUpperCase()}</span> | <span className="text-primary">{username}</span>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            to="#"
                            onClick={this.props.logout}
                            activeClassName="active"
                            className="nav-link mx-2">
                            <FontAwesomeIcon icon={faSignOutAlt}/>
                            &ensp;Sign Out
                        </Link>
                    </NavItem>
                </React.Fragment>
            );

            if (type === "admin") {
                drop = (<UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Options
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <Link exact to="/course" className="navbar-brand">
                                <span style={{color: '#5cb85c', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faBook}
                                />
                                &ensp;Courses
                                </span>
                            </Link>
                        </DropdownItem>
                        <DropdownItem>
                            <Link exact to="/instructor" className="navbar-brand">
                                <span style={{color: '#5cb85c', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faUserTie}
                                />
                                &ensp;Instructors
                                </span>
                            </Link>
                        </DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem>
                            <Link exact to="/admin" className="navbar-brand">
                                <span style={{color: '#F00', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faUserSecret}
                                />
                                &ensp;Admin
                                </span>
                            </Link>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>);
            } else if (type === "instructor") {
                drop = (<UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Options
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <Link exact to="/instructor/courses" className="navbar-brand">
                                <span style={{color: '#5cb85c', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faBook}
                                />
                                    &ensp;Courses
                                </span>
                            </Link>
                        </DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem>
                            <Link exact to="/notifications" className="navbar-brand">
                                <span style={{color: '#428bca', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faBell}
                                />
                                    &ensp;Notifications
                                </span>
                            </Link>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>);
            } else {
                drop = (<UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Options
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <Link exact to="/student/courses/enrolled" className="navbar-brand">
                                <span style={{color: '#5cb85c', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faBook}
                                />
                                    &ensp;Enrolled Courses
                                </span>
                            </Link>
                        </DropdownItem>
                        <DropdownItem>
                            <Link exact to="/student/courses/all" className="navbar-brand">
                                <span style={{color: '#5cb85c', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faStream}
                                />
                                    &ensp;All Courses
                                </span>
                            </Link>
                        </DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem>
                            <Link exact to="/notifications" className="navbar-brand">
                                <span style={{color: '#428bca', fontSize: 'large'}}>
                                <FontAwesomeIcon
                                    icon={faBell}
                                />
                                    &ensp;Notifications
                                </span>
                            </Link>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>);
            }
        }

        return (
            <Navbar color="light" light expand="md" className="navBar">
                <Link exact to="/" className="navbar-brand">
                    UniHub&ensp;
                    <FontAwesomeIcon
                        style={{ transform: "scale(-1, 1)", color: "rgba(0, 128, 0, 1)" }}
                        icon={faGraduationCap}
                    />
                </Link>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        {auth}
                        {drop}
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;
