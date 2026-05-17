const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Tạo transporter với cấu hình Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // SSL
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, // Email gửi (VD: your_email@gmail.com)
            pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password)
        },
    });

    // 2. Cấu hình nội dung email
    const mailOptions = {
        from: `"PhoneStore Admin" <${process.env.EMAIL_USER}>`, 
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.htmlMessage,
    };

    // 3. Gửi email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully: %s", info.messageId);
    
    return info;
};

module.exports = sendEmail;
