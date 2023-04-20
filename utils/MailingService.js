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

async function sendVerificationEmail(user, url) {
    const email = user.email;
    const subject = "Account verification"

    const text = (`Please click the following link to verify your account and This link will expire in 15 minutes.: ${url}`)

    try {
        await sendEmail(email, subject, text)

    } catch (error) {
        console.log(error)
    }
}


module.exports = {sendEmail,sendVerificationEmail}