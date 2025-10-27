const moment = require("moment");
const momenttz = require("moment-timezone");

exports.dateTimeNow = () => {
  let date = momenttz(new Date())
    .tz("Asia/Jakarta")
    .format("YYYY-MM-DD HH:mm:ss ZZ");
  return date;
};
exports.dateNowFormat = (params) => {
  let date = momenttz(new Date()).tz("Asia/Jakarta").format(params);
  return date;
};
exports.dateTimeNowID = () => {
  const date = momenttz(new Date())
    .tz("Asia/Jakarta")
    .locale("id")
    .format("DD MMM YYYY");
  return date;
};
exports.dateTimeNowIDReq = (req) => {
  const date = momenttz(req)
    .tz("Asia/Jakarta")
    .locale("id")
    .format("DD MMM YYYY");
  return date;
};
exports.dateTimeAdd = (number, type) => {
  const date = momenttz(new Date())
    .tz("Asia/Jakarta")
    .add(number.toString(), type)
    .format("YYYY-MM-DD HH:mm:ss ZZ");
  return date;
};
