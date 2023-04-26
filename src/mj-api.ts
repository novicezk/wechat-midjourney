import { Request } from "./request.js";

const request = new Request({});

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
