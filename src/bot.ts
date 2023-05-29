import { Message } from "wechaty";
import { WechatyInterface, ContactInterface } from 'wechaty/impls';
import * as PUPPET from 'wechaty-puppet';
import QRCode from "qrcode";
import { logger } from "./utils.js";
import { MJApi, SubmitResult } from "./mj-api.js";
import { Sensitive } from "./sensitive.js";

export class Bot {
    botName: string = "MJ-BOT";
    createTime: number;
    wechaty: WechatyInterface;
    mjApi: MJApi;
    sensitive: Sensitive;

    constructor(wechaty: WechatyInterface, mjApi: MJApi) {
        this.createTime = Date.now();
        this.wechaty = wechaty;
        this.mjApi = mjApi;
        this.sensitive = new Sensitive();
    }

    public async start() {
        this.wechaty.on("scan", async qrcode => {
            logger.info(`Scan qrcode to login: https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`);
            console.log(await QRCode.toString(qrcode, { type: "terminal", small: true }));
        }).on("login", user => {
            logger.info("User %s login success", user.name());
            this.botName = user.name();
        }).on("message", async message => {
            if (message.date().getTime() < this.createTime) {
                return;
            }
            if (!message.room()) {
                return;
            }
            try {
                await this.handle(message);
            } catch (e) {
                logger.error("Handle message error", e);
            }
        });
        await this.wechaty.start();
    }

    private async handle(message: Message) {
        const rawText = message.text();
        const talker = message.talker();
        const room = message.room();
        if (!room) {
            return;
        }
        const topic = await room.topic();
        if (this.isNonsense(talker, message.type(), rawText)) {
            return;
        }
        if (rawText == '/help') {
            const result = this.getHelpText();
            await room.say(result);
            return;
        }
        const talkerName = talker.name();
        logger.info("[%s] %s: %s", topic, talkerName, rawText);
        if (!rawText.startsWith('/imagine ') && !rawText.startsWith('/up ')) {
            return;
        }
        if (this.sensitive.hasSensitiveWord(rawText)) {
            await room.say(`@${talkerName} \n⚠ 可能包含违禁词, 请检查`);
            return;
        }
        // 调用mj绘图
        let result;
        if (rawText.startsWith('/imagine ')) {
            const prompt = rawText.substring(9);
            result = await this.mjApi.submitTask("/submit/imagine", {
                state: topic + ':' + talkerName,
                prompt: prompt
            });
        } else {
            const content = rawText.substring(4);
            result = await this.mjApi.submitTask("/submit/simple-change", {
                state: topic + ':' + talkerName,
                content: content
            });
        }
        if (!result) {
            return;
        }
        let msg;
        if (result.code == 22) {
            msg = `@${talkerName} \n⏰ ${result.description}`;
        } else if (result.code != 1) {
            msg = `@${talkerName} \n❌ ${result.description}`;
        }
        if (msg) {
            await room.say(msg);
            logger.info("[%s] %s: %s", topic, this.botName, msg);
        }
    }

    private getHelpText(): string {
        return "欢迎使用MJ机器人\n"
            + "------------------------------\n"
            + "🎨 AI绘图命令\n"
            + "输入: /imagine prompt\n"
            + "prompt 即你提的绘画需求\n"
            + "------------------------------\n"
            + "📕 prompt附加参数 \n"
            + "1.解释: 在prompt后携带的参数, 可以使你的绘画更别具一格\n"
            + "2.示例: /imagine prompt --ar 16:9\n"
            + "3.使用: 需要使用--key value, key和value空格隔开, 多个附加参数空格隔开\n"
            + "------------------------------\n"
            + "📗 附加参数列表\n"
            + "1. --v 版本 1,2,3,4,5 默认5, 不可与niji同用\n"
            + "2. --niji 卡通版本 空或5 默认空, 不可与v同用\n"
            + "3. --ar 横纵比 n:n 默认1:1\n"
            + "4. --q 清晰度 .25 .5 1 2 分别代表: 一般,清晰,高清,超高清,默认1\n"
            + "5. --style 风格 (4a,4b,4c)v4可用 (expressive,cute)niji5可用\n"
            + "6. --s 风格化 1-1000 (625-60000)v3";
    }

    private isNonsense(talker: ContactInterface, messageType: PUPPET.types.Message, text: string): boolean {
        return messageType != PUPPET.types.Message.Text ||
            // talker.self() ||
            talker.name() === "微信团队" ||
            text.includes("收到一条视频/语音聊天消息，请在手机上查看") ||
            text.includes("收到红包，请在手机上查看") ||
            text.includes("收到转账，请在手机上查看") ||
            text.includes("/cgi-bin/mmwebwx-bin/webwxgetpubliclinkimg");
    }

}