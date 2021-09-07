require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendEmail(email, code, type) {
  try {
    const smtpEndpoint = "smtp.sendgrid.net";
    const port = 465;
    const senderAddress = "caio.silva.teixeira@usp.br";
    var toAddress = email;
    const smtpUsername = "apikey";
    const smtpPassword = process.env.SENDGRID_API_KEY;
    
    if (type === 'register') {
      var subject = "Verifique seu e-mail :)";
      var body_html = `<!DOCTYPE> 
      <html>
        <body>
          <h2>Obrigado por se cadastrar!</h2>
          <p>Seu código de confirmação é: </p> <b>${code}</b>
        </body>
      </html>`;
    } else if (type === 'resetPassword') {
      var subject = "Código para alterar senha";
      var body_html = `<!DOCTYPE> 
      <html>
        <body>
          <p>Seu código para definição da nova senha é: </p> <b>${code}</b>
        </body>
      </html>`;
    }

    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: true,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };

    let info = await transporter.sendMail(mailOptions);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

module.exports = { sendEmail };