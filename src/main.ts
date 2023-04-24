import { WechatyBuilder } from "wechaty";
import { FileBox } from 'file-box';
import QRCode from "qrcode";
import { Bot } from "./bot.js";

import express, { Application, Request, Response } from "express";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 4120;

const bot = new Bot();

const client = WechatyBuilder.build({
  name: "wechat-assistant",
  puppet: "wechaty-puppet-wechat",
  puppetOptions: {
    uos: true
  }
});

async function main() {
  const initializedAt = Date.now();
  client.on("scan", async (qrcode) => {
    const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
    console.log(`scan qrcode to login: ${url}`);
    console.log(
      await QRCode.toString(qrcode, { type: "terminal", small: true })
    );
  }).on("login", async (user) => {
    console.log(`user ${user.name()} login success`);
    bot.setBotName(user.name());
  }).on("message", async (message) => {
    if (message.date().getTime() < initializedAt) {
      return;
    }
    if (!message.room()) {
      // 暂不处理私聊信息
      return;
    }
    bot.onMessage(message);
  });
  try {
    await client.start();
  } catch (e) {
    console.error(
      `wechat client start failed: ${e}`
    );
  }
}
main();

app.post("/wechat-mj/notify", async (req: Request, res: Response): Promise<Response> => {
  const type = req.body.type;
  const roomName = req.body.room;
  const userName = req.body.user;
  const room = await client.Room.find({ topic: roomName });
  if (!room) {
    return res.status(404).send("room not found");
  }
  if ('created' == type) {
    const prompt = req.body.prompt;
    const messageId = req.body.messageId;
    await room.say(`@${userName} \n✅ 您的任务已提交\n✨ Prompt: ${prompt}\n🌟 ID: ${messageId}\n🚀 正在快速处理中,请稍后!`);
  } else if ('image' == type) {
    const messageId = req.body.messageId;
    await room.say(`@${userName} \n🎨 绘画成功!\n📨 ID: ${messageId}\n🪄 变换:\n[ U1 ] [ U2 ] [ U3 ] [ U4 ]\n[ V1 ] [ V2 ] [ V3 ] [ V4 ]\n✏️ 可使用 [/up-任务ID-操作] 进行变换\n/up ${messageId} U1`);
    const image = FileBox.fromUrl(req.body.imageUrl);
    room.say(image);
  } else if ('up' == type) {
    const image = FileBox.fromUrl(req.body.imageUrl);
    room.say(image);
  } else {
    return res.status(405).send("type not supported");
  }
  return res.status(200).send({ code: 1 });
});

try {
  app.listen(port, (): void => {
    console.log(`Notify server start success on port ${port}`);
  });
} catch (e) {
  console.error(`Notify server start failed: ${e}`);
}
