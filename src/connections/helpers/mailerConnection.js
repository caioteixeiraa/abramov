require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendEmail(mentee, mentor) {
  try {
    const smtpEndpoint = "smtp.sendgrid.net";
    const port = 465;
    const senderAddress = "caio.silva.teixeira@usp.br";
    var toAddress = mentee.email;
    var cc = mentor.email;
    const smtpUsername = "apikey";
    const smtpPassword = process.env.SENDGRID_API_KEY;
  
      var subject = "🚀 Uma conexão foi feita! :D";
      var body_html = `<!DOCTYPE> 
      <html>
        <body>
          <h2>A conexão aconteceu! Vamos conversar? 💬</h2>
          <p>
            <b>${mentee.name}</b> e <b>${mentor.name}</b>, vocês foram conectadas(os) porque possuem interesses e carreiras que podem ser 
            interessantes para <b>ajudar a pessoa mentorada a conseguir seu primeiro emprego em tecnologia</b>.
          </p>
          <h3>Guia para começar a conexão 👀</h3>
          <p>Fiquem a vontade para usar esse mesmo e-mail como resposta para começar a conversar e sigam essas dicas: </p>
          <ul>
            <li>Comecem se apresentando brevemente aqui no e-mail</li>
            <li>Já manda um horário de uns 30 minutinhos nessa semana para vocês poderem marcar uma chamada no Google Meet / Zoom / onde acharem melhor</li>
            <li>Usem esse horário para se conhecerem e a(o) mentor(a) já pode compartilhar suas experiências</li>
            <li>Não esqueçam de marcar as próximas conversas!</li>
          </ul>

          <p>Qualquer problema, podem mandar um e-mail pedindo alguma ajuda por aqui mesmo :)</p>
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