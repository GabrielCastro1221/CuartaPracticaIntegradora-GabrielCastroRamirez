const jwt = require("jsonwebtoken");
const winston = require("winston");

const User = require("../models/user.model.js");
const Cart = require("../models/cart.model.js");
const EmailManager = require("../services/mailer/mailer.js");

const configObject = require("../config/env.config.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const DTO = require("../dto/user.dto.js");
const { generarResetToken } = require("../utils/tokenReset.js");

const emailManager = new EmailManager();

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).send("El usuario ya esta registrado");
      }
      const newCart = new Cart();
      await newCart.save();
      const newUser = new User({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });
      await newUser.save();
      const token = jwt.sign({ user: newUser }, configObject.auth.jwt_secret, {
        expiresIn: "1h",
      });
      res.cookie(configObject.auth.cookie_token, token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.redirect("/api/users/profile");
    } catch (error) {
      winston.error(error);
      res.status(500).send("Error al registrar usuario");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const userFound = await User.findOne({ email });
      if (!userFound) {
        return res.status(401).send("Credenciales incorrectas");
      }
      const isValid = isValidPassword(password, userFound);
      if (!isValid) {
        return res.status(401).send("Contraseña incorrecta");
      }
      const token = jwt.sign(
        { user: userFound },
        configObject.auth.jwt_secret,
        {
          expiresIn: "1h",
        }
      );
      res.cookie(configObject.auth.cookie_token, token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.redirect("/api/users/profile");
    } catch (error) {
      winston.error(error);
      res.status(500).send("Error al iniciar sesion");
    }
  }

  async profile(req, res) {
    const dto = new DTO(
      req.user.first_name,
      req.user.last_name,
      req.user.email,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: dto, isAdmin });
  }

  async logout(req, res) {
    res.clearCookie(configObject.auth.cookie_token);
    res.redirect("/");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.redirect("/access-denied");
    }
    res.render("admin");
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      const token = generarResetToken();
      user.resetToken = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();
      await emailManager.enviarCorreoRestableciminto(
        email,
        user.first_name,
        token
      );
      res.redirect("/confirmacion-envio");
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("passwordCambio", { error: "Usuario no encontrado" });
      }
      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetpassword", {
          error: "Token invalido, intenta nuevamente",
        });
      }
      const now = new Date();
      if (now > resetToken.expire) {
        return res.render("resetpassword", { error: "el token ha expirado" });
      }
      if (isValidPassword(password, user)) {
        return res.render("passwordCambio", {
          error: "La nueva contraseña no puede ser igual a la anterior",
        });
      }
      user.password = createHash(password);
      user.resetToken = undefined;
      await user.save();
      return res.redirect("/");
    } catch (error) {
      res
        .status(500)
        .render("resetpassword", { error: "Error interno del servidor" });
    }
  }

  async cambiarRolPremium(req, res) {
    const { uid } = req.params;
    try {
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).send("usuario no encontrado");
      }
      const nuevoRol = user.role === "usuario" ? "premium" : "usuario";
      const actualizado = await User.findByIdAndUpdate(uid, { role: nuevoRol });
      res.json(actualizado);
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }
}

module.exports = UserController;
