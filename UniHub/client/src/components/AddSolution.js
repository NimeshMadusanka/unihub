import React, { Component } from "react";
import Progress from "./UploadProgress";
import axios from "axios";
import Alert from "./Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

class AddSolution extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: "",
            assignment: "",
            student: "",
            file: "",
            fileName: "Choose File",
            uploadPercentage: 0,
            alert: false,
            alertText: null
        };
    }

    componentDidMount() {
        this.setState({
            course: this.props.course._id,
            assignment: this.props.assignment._id,
            student: this.props.session.user._id
        });
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        }, () => {
            this.setState({ uploadPercentage: 0 }, () => {
                this.props.reload();
            });
        });
    };

    onChange = event => {
        this.setState({
            file: event.target.files[0],
            fileName: event.target.files[0].name
        });
    };


    onSubmit = async event => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('file', this.state.file);

        try {

            const res = await axios.post(`/api/solution/assignment/${this.state.assignment}/course/${this.state.course}/student/${this.state.student}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-authorize-token": this.props.session.token,
                    "x-authorize-type": this.props.session.type
                },
                onUploadProgress: progressEvent => {
                    this.setState({
                        uploadPercentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    });
                }
            });

            this.setState({
                alert: true,
                alertText: res.data.msg
            });

        } catch (err) {

            if (err.response.status === 500) {
                this.setState({
                    alert: true,
                    alertText: err.response.data.msg
                });
            } else {
                this.setState({
                    alert: true,
                    alertText: err.response.data.msg
                });
            }

        }
    };

    render() {

        let alert = "";
        if (this.state.alert)
            alert = <Alert alertText={this.state.alertText} resetAlert={this.resetAlert}/>;

        return (
            <React.Fragment>
                <form onSubmit={this.onSubmit}>
                    <div className="pr-4 pl-3">
                        <div className='custom-file mb-4'>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                onChange={this.onChange}
                            />
                            <label className='custom-file-label' htmlFor='customFile'>
                                {this.state.fileName}
                            </label>
                        </div>

                        <Progress percentage={this.state.uploadPercentage}/>

                        <div className="text-right">
                            <button
                                type='submit'
                                className='button'
                            ><FontAwesomeIcon icon={faFileUpload}/>&ensp;Upload
                            </button>
                        </div>
                    </div>
                </form>
                {alert}
            </React.Fragment>
        );

    }

}

export default AddSolution;