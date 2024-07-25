const dotenv = require("dotenv");
const program = require("./commander.config");

const { mode } = program.opts();

dotenv.config({
  path: mode === "dev" ? "./.env.dev" : "./.env.build",
});

const configObject = {
  server: {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT || 5000,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
    cookie_token: process.env.COOKIE_TOKEN,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_secret: process.env.GITHUB_SECRET,
    github_url: process.env.GITHUB_URL,
  },
  mailer: {
    mailer_user: process.env.MAILER_USER,
    mailer_pass: process.env.MAILER_PASS,
  },
  winston: {
    node_env: process.env.NODE_ENV,
  },
};

module.exports = configObject;
