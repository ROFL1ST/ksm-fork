exports.generatePassword = (realname) => {
  const namePart = realname.slice(0, 3).toLowerCase();
  const symbols = ["#", "@", "$", "!", "%", "&"];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomNum = Math.floor(100 + Math.random() * 900);

  const password = `${namePart}${randomSymbol}${randomNum}`;
  return password.slice(0, 6);
};
