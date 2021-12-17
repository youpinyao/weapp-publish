export default async function waitForFunctionImage(page, selector) {
  await page.waitForFunction(
    function (_, selector) {
      const qrcode = document.querySelector(selector);
      return !!(qrcode && qrcode.getAttribute("src") && qrcode.complete);
    },
    {},
    selector
  );
}
