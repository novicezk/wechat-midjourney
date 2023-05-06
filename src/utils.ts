import dayjs from "dayjs";
import { ContactInterface } from "wechaty/impls";
import * as PUPPET from 'wechaty-puppet';
import { config } from "./config.js";

export function displayMilliseconds(millisecond: number): string {
  const minute = Math.floor(millisecond / 1000 / 60);
  const second = Math.floor((millisecond - minute * 1000 * 60) / 1000);
  return minute == 0 ? (second + '秒') : (minute + '分' + second + '秒');
}

export function formatDateStandard(date: Date): string {
  return formatDate(date, "YYYY-MM-DD HH:mm:ss");
}

export function formatDate(date: Date, pattern: string): string {
  return dayjs(date).format(pattern);
}

export function isProhibited(text: string): boolean {
  if (config.blockWords.length == 0) {
    return false;
  }
  return config.blockWords.some((word) => text.includes(word));
}

export function isNonsense(talker: ContactInterface, messageType: PUPPET.types.Message, text: string): boolean {
  return messageType != PUPPET.types.Message.Text ||
    // talker.self() ||
    talker.name() === "微信团队" ||
    text.includes("收到一条视频/语音聊天消息，请在手机上查看") ||
    text.includes("收到红包，请在手机上查看") ||
    text.includes("收到转账，请在手机上查看") ||
    text.includes("/cgi-bin/mmwebwx-bin/webwxgetpubliclinkimg");
}