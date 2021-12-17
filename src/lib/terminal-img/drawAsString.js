const chalk_1 = require('chalk');
const jimp_1 = require('jimp');
const characterFullBlock = '\u2588',
  characterLowerHalfBlock = '\u2584';
const drawAsString = async function (fileName, options = {}) {
  let requestedWidth = options.width;
  let requestedHeight = options.height;
  if (!requestedWidth && !requestedHeight) {
    requestedWidth = process.stdout.columns || 80;
  }
  requestedWidth =
    requestedWidth !== null && requestedWidth !== void 0
      ? requestedWidth
      : jimp_1.AUTO;
  requestedHeight =
    requestedHeight !== null && requestedHeight !== void 0
      ? requestedHeight
      : jimp_1.AUTO;
  const image = await jimp_1.read(fileName);
  const resizedImage = image.resize(
    requestedWidth,
    requestedHeight,
    jimp_1.RESIZE_NEAREST_NEIGHBOR
  );
  let result = '';
  for (let y = 0; y < resizedImage.bitmap.height; y += 2) {
    for (let x = 0; x < resizedImage.bitmap.width; x++) {
      const upperColor = resizedImage.getPixelColor(x, y);
      const lowerColor = resizedImage.getPixelColor(x, y + 1);
      const upperColorAsRgba = jimp_1.intToRGBA(upperColor);
      const lowerColorAsRgba = jimp_1.intToRGBA(lowerColor);
      if (upperColor === lowerColor) {
        result += chalk_1
          .bgRgb(upperColorAsRgba.r, upperColorAsRgba.g, upperColorAsRgba.b)
          .rgb(
            upperColorAsRgba.r,
            upperColorAsRgba.g,
            upperColorAsRgba.b
          )(characterFullBlock);
        continue;
      }
      result += chalk_1
        .bgRgb(upperColorAsRgba.r, upperColorAsRgba.g, upperColorAsRgba.b)
        .rgb(
          lowerColorAsRgba.r,
          lowerColorAsRgba.g,
          lowerColorAsRgba.b
        )(characterLowerHalfBlock);
    }
    result += '\n';
  }
  return result;
};

module.exports = drawAsString;
