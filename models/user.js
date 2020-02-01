const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: /@/,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
}, { timeStamps: true });

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const encryptedPassword = await bcrypt.hash(this.password, 10)
    console.log(encryptedPassword, this);
    if (encryptedPassword) this.password = encryptedPassword;
  }
  next();
});


userSchema.methods.verifyPassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, matched) => {
    if (err) return done(null, false);
    done(null, matched);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
