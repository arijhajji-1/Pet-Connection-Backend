const nodemailer = require('nodemailer')



// Create a singleton transporter object
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "testini435@gmail.com",
        pass: "zinehprkliupnwuk",
    },
});

async function sendEmail(email, subject, text) {
    try {
        const mailOptions = {
            from: '"PetConnection" <yosramekaoui@gmail.com>',
            to: email,
            subject,
            text:text,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
        throw error;
    }
}


module.exports = {sendEmail}
