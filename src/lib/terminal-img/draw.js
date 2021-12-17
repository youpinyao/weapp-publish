
const drawAsString = require('./drawAsString');
const draw = async function (fileName, options) {
  process.stdout.write(await drawAsString(fileName, options));
};

module.exports = draw;
