import { draw } from "terminal-img";
import path from "path";
import fs from "fs-extra";
import QrCode from "qrcode-reader";
import Jimp from "jimp";
import qrcodeTerminal from "qrcode-terminal";
import chalk from "chalk";

const __dirname = path.resolve();

export default function logQrcode(qrcode) {
  const qrcodePath = path.join(__dirname, "qrcode.png");
  const fallback = async () => {
    // 画二维码图
    await draw(qrcodePath, {
      width: 100,
      height: 100,
    });
    fs.unlinkSync(qrcodePath);
  };

  // 保存二维码图片
  fs.writeFileSync(
    qrcodePath,
    Buffer.from(qrcode.replace(/^data:image\/\w+;base64,/, ""), "base64")
  );

  return new Promise((resolve, reject) => {
    Jimp.read(fs.readFileSync(qrcodePath), async function (err, image) {
      if (err) {
        // console.log("Jimp error", err);
        await fallback();
        reject(`Jimp error ${err}`);
        return;
        // TODO handle error
      }
      var qr = new QrCode();
      qr.callback = async function (err, value) {
        if (err) {
          // console.log("qrcodeReader error", err);
          await fallback();
          reject(`qrcodeReader error ${err}`);
          // TODO handle error
        } else {
          // console.log(value);
          console.log(chalk.green(value.result));
          qrcodeTerminal.generate(value.result, {
            small: true,
          });
          fs.unlinkSync(qrcodePath);
          resolve(value);
        }
      };
      qr.decode(image.bitmap);
    });
  });
}
