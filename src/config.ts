import * as dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

export interface IConfig {
  mjProxyEndpoint: string;
  notifyHook: string;
  httpProxy: string;
  imagesPath: string;
}

export const config: IConfig = {
  mjProxyEndpoint: process.env.MJ_PROXY_ENDPOINT || "http://localhost:8022/mj",
  notifyHook: process.env.MJ_NOFIFY_HOOK || "http://localhost:4120/notify",
  httpProxy: process.env.HTTP_PROXY || "",
  imagesPath: process.env.IMAGE_PATH || ""
}