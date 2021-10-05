require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendEmail(emailMentee, emailMentor) {
  try {
    const smtpEndpoint = "smtp.sendgrid.net";
    const port = 465;
    const senderAddress = "caio.silva.teixeira@usp.br";
    var toAddress = emailMentee;
    var cc = emailMentor
    const smtpUsername = "apikey";
    const smtpPassword = process.env.SENDGRID_API_KEY;
  
      var subject = "Uma conexão foi feita! :D";
      var body_html = `<!DOCTYPE> 
      <html>
        <body>
          <h2>A conexão aconteceu!</h2>
          <p>Vamos conversar?</p>
        </body>
      </html>`;

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
      cc: cc,
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