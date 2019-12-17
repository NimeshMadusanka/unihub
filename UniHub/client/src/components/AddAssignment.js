import React, { Component } from 'react';
import Progress from './UploadProgress';
import axios from 'axios';
import Alert from './Alert';
import { Col, FormGroup, FormText, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faCalendarDay, faFileUpload } from "@fortawesome/free-solid-svg-icons";

class AddAssignment extends Component{

    constructor(props) {
        super(props);
        this.state ={
            name: '',
            course: '',
            deadline: '',
            file: '',
            fileName: 'Choose File',
            uploadPercentage: 0,
            alert: false,
            alertText: null
        }
    }

    componentDidMount() {
        this.setState({
            course: this.props.course._id
        })
    }

    resetAlert = () => {
        this.setState({
            alert: false,
            alertText: null
        }, () => {
            this.setState({uploadPercentage: 0});
            this.props.reload();
        });
    };

    handleChange = event => {
      this.setState({
          [event.target.name]: event.target.value
      })
    };

    onChange = event => {
      this.setState({
          file: event.target.files[0],
          fileName: event.target.files[0].name
      })
    };


    onSubmit = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.file);
        formData.set('name', this.state.name);
        formData.set('deadline', this.state.deadline);
        formData.set('course', this.state.course);

        try {

            const res = await axios.post('/api/assignment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-authorize-token': this.props.session.token,
                    'x-authorize-type': this.props.session.type
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
                    <h1 className="mt-4 mb-4 text-success text-center">Add Assignment</h1>
                    <hr/>
                    <form onSubmit={this.onSubmit}>
                        <div className="mr-0">
                            <div className="row container-fluid mr-0 pr-0">
                                <Col md={12} className="mb-4">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText className="adTextBox">
                                                <FontAwesomeIcon icon={faFileAlt}/>
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
                                                    <FontAwesomeIcon icon={faCalendarDay}/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                autoComplete="off"
                                                required
                                                value={this.state.deadline}
                                                onChange={this.handleChange}
                                                className="select"
                                                type="date"
                                                name="deadline"
                                                placeholder="Deadline"
                                            />
                                        </InputGroup>
                                        <FormText className="ml-3">Please a date and a time in the future.</FormText>
                                    </FormGroup>
                                </Col>
                            </div>
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

                                    <Progress percentage={this.state.uploadPercentage} />

                                    <div className="text-right">
                                        <button
                                            type='submit'
                                            className='button'
                                        ><FontAwesomeIcon icon={faFileUpload}/>&ensp;Upload</button>
                                    </div>
                            </div>
                        </div>
                    </form>
                    {alert}
            </React.Fragment>
        );

    }

}

export default AddAssignment;