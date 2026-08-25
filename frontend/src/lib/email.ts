import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendAdminWelcomeEmail(toEmail: string, name: string, tempPassword?: string) {
  const mailOptions = {
    from: `"Aaj Tech Trading" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Welcome to Aaj Tech Trading Admin Portal',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #D2232A;">Welcome to Aaj Tech Trading</h2>
                <p>Dear ${name || 'Admin'},</p>
                <p>Your admin account has been created successfully. You can now log in to the admin portal.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #D2232A;">
                  <p style="margin: 0;"><strong>Login Details:</strong></p>
                  <p style="margin: 10px 0 0 0;"><strong>Email:</strong> ${toEmail}</p>
                  ${tempPassword ? `<p style="margin: 10px 0 0 0;"><strong>Password:</strong> ${tempPassword}</p>` : ''}
                </div>
                <p>Please log in at <a href="${process.env.NEXT_PUBLIC_API_URL}/attc-manage/" style="color: #D2232A;">${process.env.NEXT_PUBLIC_API_URL}/attc-manage/</a>.</p>
                <p>If you have any issues, please contact the Super Admin.</p>
                <p>Best Regards,<br>Team Aaj Tech Trading</p>
            </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to', toEmail);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

