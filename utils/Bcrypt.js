const bcrypt = require("bcryptjs");

exports.PasswordEncrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

exports.PasswordCompare = async (password, hash) => {
  let check = await bcrypt.compare(password, hash);
  if (check === false) return { status: false };
  return { status: true };
};
