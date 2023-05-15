import { config } from "./config.js";
import axios from 'axios';
import { FileBox } from 'file-box';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpsProxyAgent } from "https-proxy-agent"
import * as fs from 'fs';

import { Request } from "./request.js";

const request = new Request({})

export async function submitTask(params: any): Promise<string> {
    let url = "/trigger/submit";
    if (params.action == 'UV') {
        url = "/trigger/submit-uv";
    }
    try {
        const response = await request.post(url, params);
        if (response.status !== 200) {
            console.log(`提交任务错误: ${response.status}, ${response.statusText}`);
            return "MJ服务异常，请稍后再试";
        }
        const message = response.data;
        if (message.code != 1) {
            console.log(`提交任务错误: ${message.code}, ${message.description}`);
            return `提交任务失败\n - ${message.description}`;
        }
        return "";
    } catch (e) {
        console.error(`submit task failed: ${e}`);
        return "系统异常，请稍后再试";
    }
}

export async function downloadImage(url: string): Promise<FileBox> {
    const response: AxiosResponse = await axios({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        httpsAgent: config.httpProxy != "" ? new HttpsProxyAgent(config.httpProxy) : undefined,
        timeout: 10000,
    });

    const filename = url.split('/')!.pop()!;
    if (config.imagesPath!="") {
      fs.writeFileSync(config.imagesPath + '/' + filename, response.data, 'binary');
    }
    const fileBuffer = Buffer.from(response.data, 'binary');

    return  FileBox.fromBuffer(fileBuffer, filename);

}
