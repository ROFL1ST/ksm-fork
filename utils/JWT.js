const jwt = require("jsonwebtoken");

exports.JWT1hours = async (params) => {
  const token = jwt.sign({ id: params.id });
};

exports.JWTGenerate = (params) => {
  const token = jwt.sign({ id: params.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

exports.JWTRefreshGenerate = (params) => {
  const token = jwt.sign({ id: params.id }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};
