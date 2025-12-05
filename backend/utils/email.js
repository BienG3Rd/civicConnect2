const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const AppError = require('./appError');

// Create a transporter object using the default SMTP transport
let transporter;

if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Use ethereal.email for development
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'your-ethereal-email@example.com',
      pass: 'your-ethereal-password',
    },
  });
}

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Email template rendering
const generateHTML = (template, data = {}) => {
  try {
    const templatePath = `${__dirname}/../views/emails/${template}.pug`;
    const html = pug.renderFile(templatePath, data);
    return html;
  } catch (error) {
    console.error('Error rendering email template:', error);
    throw new AppError('Error rendering email template', 500);
  }
};

// Main email sending function
const sendEmail = async (options) => {
  try {
    // 1) Define email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'CivicConnect'}" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // 2) If template is provided, use it
    if (options.template) {
      const html = generateHTML(options.template, options.data);
      mailOptions.html = html;
      mailOptions.text = htmlToText(html);
    }

    // 3) Send email
    const info = await transporter.sendMail(mailOptions);
    
    // 4) Log preview URL in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError('There was an error sending the email. Try again later!', 500);
  }
};

// Email templates
const sendWelcome = async (user) => {
  await sendEmail({
    email: user.email,
    subject: 'Welcome to CivicConnect!',
    template: 'welcome',
    data: { name: user.name },
  });
};

const sendPasswordReset = async (user, resetUrl) => {
  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 minutes)',
    template: 'passwordReset',
    data: {
      name: user.name,
      resetUrl,
    },
  });
};

const sendAccountVerification = async (user, verificationUrl) => {
  await sendEmail({
    email: user.email,
    subject: 'Verify your email address',
    template: 'verifyEmail',
    data: {
      name: user.name,
      verificationUrl,
    },
  });
};

module.exports = {
  sendEmail,
  sendWelcome,
  sendPasswordReset,
  sendAccountVerification,
  transporter // Export for testing purposes
};
