// authCookies.js
const isProduction = process.env.NODE_ENV === "production";

// opsi default untuk cookie
const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction, // hanya aktif kalau production (HTTPS)
  sameSite: isProduction ? "none" : "lax", // production -> none (agar bisa cross-domain), dev -> lax
  path: "/", // cookie berlaku untuk semua route
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  // domain: "miners-api.klabbelanja.id", // 👉 aktifkan ini kalau frontend & backend beda subdomain
};

exports.setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, baseCookieOptions);
  res.cookie("refreshToken", refreshToken, baseCookieOptions);
};

exports.clearAuthCookies = (res) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};
