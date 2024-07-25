const User = require("../models/user.model.js");

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }
}

module.exports = UserRepository;
