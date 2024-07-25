const nodemailer = require("nodemailer");
const configObject = require("../../config/env.config");
const winston = require("winston");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: configObject.mailer.mailer_user,
        pass: configObject.mailer.mailer_pass,
      },
    });
  }

  async enviarCorreoCompra(email, first_name, ticket) {
    try {
      const Opt = {
        from: "Skate & Destroy<gbrlcstrrmrz@gmail.com>",
        to: email,
        subject: "Compra exitosa",
        html: `
                    <p>Gracias por tu compra! ${first_name} </p>
                    <p>orden de compra #:${ticket}</p>
                `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      winston.error("Error al enviar Email:");
    }
  }

  async enviarCorreoRestableciminto(email, first_name, token) {
    try {
      const Opt = {
        from: "Skate & Destroy<gbrlcstrrmrz@gmail.com>",
        to: email,
        subject: "Restablecimiento de contraseña",
        html: `
                    <p>Restablecimeinto de contraseña </p>
                    <p>!olvidaste tu contraseña? estimado(a) ${first_name} </p>
                    <p>Codigo de confirmacion: </p>
                    <strong> ${token} </strong>
                    <p>Este codigo expirara en una hora</p>
                    <a href="http://localhost:8080/password">Restablecer contraseña</a>
                `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      winston.error("Error al enviar el correo de restablecimiento");
    }
  }
}

module.exports = EmailManager;
