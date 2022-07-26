require('dotenv').config();
//USED FOR TESTING  DO NOT CARE
const sgrid = require('@sendgrid/mail');
const { response } = require('express');


sgrid.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
    to: 'cvmathew18@gmail.com',
    from: {
        name: 'Chris @ FeastBook',
        email:'cvmathew18@gmail.com', // Use the email address or domain you verified above
    },
    subject: 'Sending with Twilio SendGrid is Fun.',
    text: `and easy to do anywhere, even with Node.js. ${process.env.JWT_KEY}`,
    html: `<strong>and easy to do anywhere, even with Node.js ${process.env.JWT_KEY}</strong>`,
};



sgrid.send(message)
    .then((respose) => console.log('Email sent...'))
    .catch((error) => console.log(error.message))
