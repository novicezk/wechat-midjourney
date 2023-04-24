import * as dotenv from "dotenv";
dotenv.config();

export interface IConfig {
  mjProxyEndpoint: string;
  blockWords: string[]
}

export const config: IConfig = {
  mjProxyEndpoint: process.env.MJ_PROXY_ENDPOINT || "http://localhost:8022/mj",
  blockWords: process.env.BLOCK_WORDS?.split(",") || []
};
