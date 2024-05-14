const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (options) => {
    try {
        await transporter.sendMail(options);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendMail;
