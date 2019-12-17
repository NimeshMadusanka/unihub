const nodeMailer = require("nodemailer");

class MailService {

    /**
     * Creating the email template for user created message.
     * @param user
     * @param password
     * @param type
     * @returns {string}
     */
    static getUserCreatedMessage(user, password, type) {

        return `<h1 style="color: #5cb85c">New UniHub Account Login Details</h1>
                <p>Type: ${type}<br/>Email: ${user.email}<br/>Password: ${password}</p>`;

    }

    /**
     * Creating the email template for added to course message.
     * @param course
     * @returns {string}
     */
    static getAddedToCourseMessage(course) {

        return `<h1 style="color: #5cb85c">You have been added to a new Course</h1>
                <p>Course Code: ${course.code}</p>
                <p>Course Name: ${course.name}</p><br/>
                <p>Please login to the system to accept or reject the course.</p>`;

    }

    /**
     * Sending the email to the User.
     * @param email
     * @param subject
     * @param message
     */
    static sendMail(email, subject, message) {

        this.transporter = nodeMailer.createTransport({
            service: "gmail",
            secure: false,
            port: 25,
            auth: {
                user: "unihubsystems@gmail.com",
                pass: "ab12AB!@"
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        this.mailOptions = {
            from: "unihubsystems@gmail.com",
            to: email,
            subject,
            html: message
        };

        MailService.transporter.sendMail(this.mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    }

}

module.exports = MailService;