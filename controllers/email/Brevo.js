const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com', // Replace with the SES SMTP endpoint for your region
        port: 587, // Use port 587 for TLS, or 465 for SSL
        secure: false, // Set to true if you are using SSL, false for TLS
        auth: {
          user: 'sumanthn876@gmail.com', // Replace with your SES SMTP username
          pass: 'UCjS89kKd3FGYXQ7', // Replace with your SES SMTP password
        },
      });
      

module.exports = transporter;