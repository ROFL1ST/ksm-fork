const jwt = require("jsonwebtoken");

exports.JWTVerify = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      status: false,
      code: 401,
      message: "No access token found. Please login first.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: false,
        code: 403,
        message: "Invalid or expired token.",
      });
    }
    req.user = decoded;
    next();
  });
};
