export default async function evaluateImage(
  page,
  selector,
  opts = {
    scale: 4,
  }
) {
  return await page.evaluate((selector, opts) => {
    const qrcode = document.querySelector(selector);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = qrcode.width * opts.scale;
    const height = qrcode.height * opts.scale;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(qrcode, 0, 0, width, height);

    return canvas.toDataURL();
  }, selector, opts);
}
