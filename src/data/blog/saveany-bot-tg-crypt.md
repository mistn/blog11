---
author: miuo
pubDatetime: 2026-05-22T00:00:00+08:00
modDatetime: 2026-05-22T00:00:00+08:00
title: SaveAny-Bot 自动转存 TG 视频到加密云盘
featured: false
draft: false
tags:
  - Telegram
  - SaveAny-Bot
  - Rclone
  - OpenList
  - 部署
description: SaveAny-Bot 配合 Rclone 与 OpenList，实现 Telegram 视频自动转存到加密云盘的完整教程。
---

>**[SaveAny-Bot](https://github.com/krau/SaveAny-Bot) 把 Telegram 上的文件转存到多种存储端**

## 1. SaveAny-Bot 特性

- 支持文档/视频/图片/贴纸…甚至还有 [Telegraph](https://telegra.ph/)
- 破解禁止保存的文件
- 批量下载
- 流式传输
- 多用户使用
- 基于存储规则的自动整理
- 监听并自动转存指定聊天的消息, 支持过滤
- 在不同存储端之间转存文件
- 集成 yt-dlp, 从所支持的网站下载并转存媒体文件
- 集成 Aria2, 支持直链/磁力下载和转存
- 使用 js 编写解析器插件以转存任意网站的文件
- 存储端支持:
    - Alist
    - S3
    - WebDAV
    - 本地磁盘
    - Rclone
    - Telegram (重传回指定聊天)

## 2. Rclone 安装

一键安装
```
curl https://rclone.org/install.sh | sudo bash
```

Docker 部署
```
docker run -d --name rclone --restart=always \
  -v /path/to/config:/config/rclone \
  -v /path/to/data:/data \
  rclone/rclone:latest
```

验证版本
```
rclone --version
```

配置命令
```
rclone config
```

## 3. Openlist Crypt 设置

```
驱动：Crypt
挂载路径：/tg
文件名加密：标准
文件夹名称加密：是
加密后文件存储路径：/onedrive/tg
密码：随机128位
加盐：随机128位
加密后缀：.bin
文件名编码：Base32
```

## 4. Vps Rclone 设置

### 4.1 配置 OneDrive

打开 Termius
```
rclone config
```

- 按 `n` 创建 New remote
- `name>` 填 `onedrive`
- `Storage>` 填 `onedrive`
- `client_id>` 回车
- `client_secret` 回车
- `region>` 选 1(global)
- `tenant>` 回车
- `Edit advanced config?` 按 n
- `Use web browser to automatically authenticate rclone with remote?` 按 n

本地终端运行
```
rclone authorize "onedrive"
```

- 跳转到浏览器登录微软账号，复制终端里的 token
- `config_token>` 填复制的密钥

### 4.2 配置 Crypt

```
rclone config
```

- 按`n` 创建 New remote
- `name>` 填 `tg_crypt`
- `Storage>` 填 `crypt`
- `remote>` 填 `onedrive:/tg`
- `filename_encryption>` 填 1 (standard)
- `directory_name_encryption>` 填 1 (ture)
- `password>` 按 `y` 输两次
- `password_salt>` 按 `y` 输两次
- `Edit advanced config?` 按 n
- `Keep this "tg_crypt" remote` 按 y


创建测试文件看是否连通

```
echo "Hello, perfect match!" > /root/newtest.txt && rclone copy /root/newtest.txt tg_crypt:/ --ignore-times
```

## 5. 部署 SaveAny-Bot

### 5.1 Telegram 官方机器人创建

- Telegram 搜索官方机器人 `@BotFather`
- 点击 `Open` 创建机器人，用户名用 `_bot` 结尾

### 5.2 用户 ID 查看

- Telegram 搜索官方机器人 `@userinfobot`
- 输入 `/start`

### 5.3 后端接入参数配置

创建文件 `config.toml` 并填入以下内容:
```
lang = "zh"

# 你的 Bot Token, 在 @BotFather 获取
token = ""

[[storages]]
name = "tg_crypt"
type = "alist"  # 保持 alist 驱动不变
enable = true
# 填写你 VPS 的公网 IP 和 OpenList 端口
url = "http://127.0.0.1:5244" 
# 填写你的 OpenList 管理后台 Token
token = "" 
# 对应加密盘的挂载路径
base_path = "/tg" 

[[users]]
id = 112233 # 你的纯数字 ID
storages = ["tg_crypt"]
blacklist = false
```

## 6. 创建编排

```
version: '3.8'
services:
  saveany-bot:
    image: ghcr.io/krau/saveany-bot:latest
    container_name: saveany-bot
    restart: unless-stopped
    network_mode: "host" # 加上这一行！让容器直接共享宿主机网络
    volumes:
      - ./config.toml:/app/config.toml
      - ./downloads:/app/downloads
```

## 7. Telegram 自动设置

>设置自动存储规则实现转发文件自动转存到  OneDrive 加密盘

- `/start` 开始使用
- `/silent` 切换静默模式
- `/storage` 选择默认位置 tg_crypt
- `/rule` 管理自动存储规则
- `/rule switch` 开启规则模式

- 视频自动保存到 /tg/video 文件夹
```
/rule add FILENAME-REGEX (?i)\.(mp4|mkv|ts|avi|flv|mov|wmv)$ tg_crypt /tg/video
```

- 图片自动保存到 /tg/image 文件夹
```
/rule add FILENAME-REGEX (?i)\.(png|jpg|jpeg|gif|webp|bmp)$ tg_crypt /tg/image
```

- 文档自动保存到 /tg/document 文件夹
```
rule add FILENAME-REGEX (?i)\.(txt|pdf|doc|docx|xls|xlsx|ppt|pptx)$ tg_crypt /tg/document
```

## 8. 参考文档

- 1. [Github主页](https://github.com/krau/SaveAny-Bot/tree/main)
- 2. [官方文档](https://sabot.unv.app/)

