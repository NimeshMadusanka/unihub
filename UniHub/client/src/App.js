import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./css/App.css";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Course from "./components/Course";
import Instructor from "./components/Instructor";
import InstructorCourses from "./components/InstructorCourses";
import StudentCoursesAll from "./components/StudentCoursesAll";
import StudentCoursesEnrolled from "./components/StudentCoursesEnrolled";
import StudentCourse from "./components/StudentCourse";
import InstructorCourse from "./components/InstructorCourse";
import Assignment from "./components/Assignment";
import Notifications from "./components/Notifications";
import NotFound from "./components/NotFound";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";

class App extends Component {

    constructor(props) {
        super(props);
        if (read_cookie("session").isAuthenticated) {
            const cookie = read_cookie("session");
            this.state = {
                isAuthenticated: cookie.isAuthenticated,
                user: cookie.user,
                token: cookie.token,
                type: cookie.type
            };
        } else {
            this.state = {
                isAuthenticated: false,
                user: null,
                token: null,
                type: null
            };
        }
    }

    login = session => {
        let { user, token, type } = session;
        bake_cookie("session", { isAuthenticated: true, user, token, type });
        this.setState({
            isAuthenticated: true,
            user,
            token,
            type
        });
    };

    logout = () => {
        delete_cookie("session");
        this.setState({
            isAuthenticated: false,
            user: null,
            token: null,
            type: null
        });
    };

    render() {

        return (
            <Router>
                <div>
                    <NavigationBar session={this.state} logout={this.logout}/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/register" render={props => (
                            <SignUp {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/login" render={props => (
                            <SignIn {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/profile" render={props => (
                            <Profile {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/admin" render={props => (
                            <Admin {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/course" render={props => (
                            <Course {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/instructor/courses" render={props => (
                            <InstructorCourses {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/instructor" render={props => (
                            <Instructor {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/student/courses/all" render={props => (
                            <StudentCoursesAll {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/student/courses/enrolled" render={props => (
                            <StudentCoursesEnrolled {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/student/course" render={props => (
                            <StudentCourse {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/instructor/course/assignment" render={props => (
                            <Assignment {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/notifications" render={props => (
                            <Notifications {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route exact path="/instructor/course" render={props => (
                            <InstructorCourse {...props} session={this.state} login={this.login}/>
                        )}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
