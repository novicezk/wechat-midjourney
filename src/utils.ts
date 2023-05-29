import log4js from "log4js";

log4js.configure({
  appenders: {
    fileAppender: { type: "file", filename: "wechat-midjourney.log" },
    stdout: { type: "stdout", layout: { type: "pattern", pattern: "%d [%p] - %m%n" } }
  },
  categories: {
    default: { appenders: ["fileAppender", "stdout"], level: "info" }
  }
});

export const logger = log4js.getLogger();

export function displayMilliseconds(millisecond: number): string {
  const minute = Math.floor(millisecond / 1000 / 60);
  const second = Math.floor((millisecond - minute * 1000 * 60) / 1000);
  return minute == 0 ? (second + '秒') : (minute + '分' + second + '秒');
}