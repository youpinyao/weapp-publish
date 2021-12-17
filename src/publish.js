// import path from "path";
// import fs from "fs-extra";
import chalk from "chalk";
import puppeteer from "puppeteer";
import evaluateImage from "./utils/evaluateImage.js";
import logQrcode from "./utils/logQrcode.js";
import waitForFunctionImage from "./utils/waitForFunctionImage.js";
import onPageLog from "./utils/onPageLog.js";

export default async function weappPublish() {
  const browser = await puppeteer.launch({
    // headless: false,
  });
  const page = await browser.newPage({});

  page.setDefaultTimeout(100000);

  await page.goto("https://mp.weixin.qq.com/");

  // 绑定eva log
  onPageLog(page);

  console.log(chalk.green("获取登录二维码"));

  // 检测是否进入登录页
  await waitForFunctionImage(page, ".login__type__container__scan__qrcode");

  console.log(chalk.green("检测到登录二维码"));

  // 获取登录二维码
  const qrcode = await evaluateImage(
    page,
    ".login__type__container__scan__qrcode"
  );

  // 打印二维码
  try {
    await logQrcode(qrcode);
  } catch (error) {
    console.log(chalk.red(error));
  }

  console.log(chalk.green("请扫码登录"));

  // 检测是否进入登录成功后页面
  await page.waitForFunction(() => {
    const items = document.querySelectorAll(".menu_item");
    const item = [...items].filter(
      (item) => item.querySelector("a").innerText.trim() === "版本管理"
    )[0];

    return !!item;
  });
  const userInfo = await page.evaluate(() => {
    return window.__INITIAL_STATE__.userInfo;
  });

  console.log(chalk.green("登录成功"));
  console.log(chalk.green(userInfo.appid));
  console.log(chalk.green(userInfo.nickName));
  console.log(chalk.green(userInfo.userName));

  // 获取【版本管理】跳转按钮
  const versionPageButton = await page.evaluateHandle(() => {
    const items = document.querySelectorAll(".menu_item");
    const item = [...items].filter(
      (item) => item.querySelector("a").innerText.trim() === "版本管理"
    )[0];

    return item;
  });

  // 点击跳转
  if (versionPageButton) {
    versionPageButton.click();
  }

  console.log(chalk.green("跳转【版本管理】"));

  // 检测是否跳转【版本管理】页面成功
  await page.waitForFunction(() => {
    const items = document.querySelectorAll(".mod_default_hd.test_version");
    const item = [...items].filter(
      (item) => item.querySelector("h4").innerText.trim() === "审核版本"
    )[0];

    return !!item;
  });

  // 获取审核状态
  const status = await page.evaluate(() => {
    const status = document.querySelector(
      ".mod_default_bd.default_box.test_version .code_version_log_hd .simple_preview_item .status_tag"
    );

    if (status) {
      return status.innerText.trim();
    }
    return status;
  });

  // 无审核 退出
  if (!status) {
    console.log(chalk.red("无审核版本"));
    await browser.close();
    return;
  }

  // 获取描述文案
  const desc = await page.evaluate(() => {
    const desc = document.querySelector(
      ".mod_default_bd.default_box.test_version .default_box_inner"
    );

    if (desc) {
      return desc.innerText.trim().replace(/\r|\n|\\s/g, "|");
    }
    return desc;
  });

  console.log(chalk.green(desc));

  // 审核中 退出
  if (status === "审核中") {
    console.log(chalk.red("版本审核中"));
    await browser.close();
    return;
  }

  console.log(chalk.green("检测到可发布版本"));

  // 获取提交发布按钮
  const beforeSubmitButton = await page.evaluateHandle(() => {
    const buttons = document.querySelectorAll(
      ".mod_default_bd.default_box.test_version .default_box_inner .user_status .weui-desktop-btn_wrp .weui-desktop-btn.weui-desktop-btn_primary"
    );
    const button = [...buttons].filter(
      (item) => item.innerText.trim() === "提交发布"
    )[0];

    return button;
  });

  // 点击提交发布按钮
  if (beforeSubmitButton) {
    console.log(chalk.green("点击提交发布按钮"));
    beforeSubmitButton.click();
  }

  // 检测是否出现提交弹窗
  await page.waitForFunction(() => {
    const titles = document.querySelectorAll(
      ".weui-desktop-dialog .weui-desktop-dialog__hd .weui-desktop-dialog__title"
    );

    const title = [...titles].filter(
      (item) => item.innerText.trim() === "发布线上版本"
    )[0];

    const buttons = title
      ? title.parentElement.parentElement.querySelectorAll(
          ".weui-desktop-dialog__ft .weui-desktop-btn_wrp.mr .weui-desktop-btn.weui-desktop-btn_primary"
        )
      : [];
    const button = [...buttons].filter(
      (item) => item.innerText.trim() === "提交"
    )[0];

    return !!button;
  });

  // 获取提交按钮
  const submitButton = await page.evaluateHandle(() => {
    const titles = document.querySelectorAll(
      ".weui-desktop-dialog .weui-desktop-dialog__hd .weui-desktop-dialog__title"
    );

    const title = [...titles].filter(
      (item) => item.innerText.trim() === "发布线上版本"
    )[0];

    const buttons = title
      ? title.parentElement.parentElement.querySelectorAll(
          ".weui-desktop-dialog__ft .weui-desktop-btn_wrp.mr .weui-desktop-btn.weui-desktop-btn_primary"
        )
      : [];
    const button = [...buttons].filter(
      (item) => item.innerText.trim() === "提交"
    )[0];

    return button;
  });

  // 点击提交按钮
  if (submitButton) {
    console.log(chalk.green("点击提交按钮"));
    submitButton.click();
  }

  // 检测是否显示发布二维码弹窗
  await waitForFunctionImage(
    page,
    ".weui-desktop-dialog__bd .dialog_bd .weui-desktop-qrcheck .weui-desktop-qrcheck__qrcode-area .weui-desktop-qrcheck__img"
  );

  // 获取二维码
  const submitQrcode = await evaluateImage(
    page,
    ".weui-desktop-dialog__bd .dialog_bd .weui-desktop-qrcheck .weui-desktop-qrcheck__qrcode-area .weui-desktop-qrcheck__img"
  );

  // 打印二维码
  try {
    await logQrcode(submitQrcode);
  } catch (error) {
    console.log(chalk.red(error));
  }

  console.log(chalk.green("请扫码发布"));

  // 检测是否发布成功
  await page.waitForFunction(() => {
    const status = document.querySelector(
      ".mod_default_bd.default_box.test_version .code_version_log_hd .simple_preview_item .status_tag"
    );
    return !status;
  });

  console.log(chalk.green("发布成功"));

  await browser.close();
}
