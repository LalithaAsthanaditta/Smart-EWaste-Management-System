const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendPickupNotification = async (userEmail, userName, requestDetails) => {
  const subject = 'E-Waste Pickup Scheduled';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">E-Waste Pickup Scheduled</h2>
      <p>Dear ${userName},</p>
      <p>Your e-waste pickup request has been scheduled successfully!</p>
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Request Details:</h3>
        <p><strong>Device:</strong> ${requestDetails.deviceName}</p>
        <p><strong>Category:</strong> ${requestDetails.deviceCategory}</p>
        <p><strong>Condition:</strong> ${requestDetails.condition}</p>
        <p><strong>Pickup Date:</strong> ${new Date(requestDetails.pickupDate).toLocaleDateString()}</p>
        ${requestDetails.assignedPersonnel ? `<p><strong>Assigned Personnel:</strong> ${requestDetails.assignedPersonnel}</p>` : ''}
      </div>
      <p>Please ensure your e-waste items are ready for pickup on the scheduled date.</p>
      <p>Thank you for choosing our eco-friendly e-waste disposal service!</p>
      <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  await sendEmail(userEmail, subject, html);
};

module.exports = { sendEmail, sendPickupNotification };

