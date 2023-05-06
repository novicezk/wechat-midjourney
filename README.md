# wechat-midjourney

基于 [wechaty](https://github.com/wechaty/wechaty) 代理微信客户端，接入 MidJourney。
> ***微信代理有风险，使用需谨慎***

## 注意事项
- 依赖 [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) 提供的api接口
- 推荐使用docker启动；mac M或其他arm架构电脑，暂时使用npm启动

## 快速启动

1. 下载镜像
```shell
docker pull novicezk/wechat-midjourney:1.0.1
```
2. 启动容器，并设置参数
```shell
docker run -d --name wechat-midjourney \
 -p 4120:4120 \
 -e MJ_PROXY_ENDPOINT=http://172.17.0.1:8080/mj \
 --restart=always \
 novicezk/wechat-midjourney:1.0.1
```
3. 查看启动日志，微信扫描二维码，若二维码无法扫码，复制二维码链接浏览器打开扫码
```shell
docker logs -f -n 200 wechat-midjourney
```
## npm启动
```shell
git clone git@github.com:novicezk/wechat-midjourney.git
cd wechat-midjourney.git
npm install
# 可能执行错误，缺少library，按提示解决
cp .env.example .env
# 更改配置项，启动服务
npm run serve
```

## 配置项

| 变量名 | 非空 | 描述 |
| :-----| :----: | :---- |
| MJ_PROXY_ENDPOINT | 是 | midjourney代理服务的地址 |
| BLOCK_WORDS | 否 | 敏感词，英文逗号分隔 |

