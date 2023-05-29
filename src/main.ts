import { WechatyBuilder } from "wechaty";
import { MJApi } from "./mj-api.js";
import { Bot } from "./bot.js";

const wechaty = WechatyBuilder.build({
  name: "wechat-midjourney",
  puppet: "wechaty-puppet-wechat",
  puppetOptions: {
    uos: true
  }
});

const mjApi = new MJApi(wechaty);
await mjApi.listenerNotify();

const bot = new Bot(wechaty, mjApi);
await bot.start();