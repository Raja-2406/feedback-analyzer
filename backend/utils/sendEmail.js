const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("========================================");
        console.log(" [MOCK EMAIL SERVICE] ");
        console.log(` To: ${options.email}`);
        console.log(` Subject: ${options.subject}`);
        console.log(` Message: \n${options.message}`);
        console.log("========================================");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this based on provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'FeedPulse App'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
