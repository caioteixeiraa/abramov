require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendEmailProfileCreation(email, profile) {
  try {
    const smtpEndpoint = "smtp.sendgrid.net";
    const port = 465;
    const senderAddress = "caio.silva.teixeira@usp.br";
    var toAddress = email;
    const smtpUsername = "apikey";
    const smtpPassword = process.env.SENDGRID_API_KEY;
    
    var subject = "Você criou um perfil no Mentorada!";
    var body_html = `<!DOCTYPE> 
    <html>
      <body>
        <h2>Parabéns por criar seu perfil na nossa plataforma, ${profile.name.split(" ")[0]}! 🎉</h2>
        <p>A partir de agora, vamos analisar seu perfil e encontrar uma conexão que faça sentido para você.</p>
        <p>Você ainda pode editar seu perfil ou mesmo deletá-lo se for do seu interesse.</p>
        <p><b>Boa mentoria!</b></p>
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

module.exports = { sendEmailProfileCreation };