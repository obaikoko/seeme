import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_password',
  },
});


// Generate random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Send verification email
function sendVerificationEmail(email, token) {
    const verificationLink = `http://yourwebsite.com/verify?token=${token}`;
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        html: `Click <a href="${verificationLink}">here</a> to verify your email address.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}