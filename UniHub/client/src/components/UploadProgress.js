import React, { Component } from "react";

class UploadProgress extends Component {

    render() {

        const { percentage } = this.props;

        return <div className='progress'>
            <div
                className='progress-bar progress-bar-striped bg-success'
                role='progressbar'
                style={{ width: `${percentage}%` }}
            >
                {percentage}%
            </div>
        </div>;

    }

}

export default UploadProgress;