import chalk from "chalk";

export default function onPageLog(page) {
  page.on("console", (msg) => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(chalk.green(msg.text()));
  });
}
