---
author: miuo
pubDatetime: 2026-01-31T00:00:00+08:00
modDatetime: 2026-01-31T00:00:00+08:00
title: PicList + Cloudflare R2 + Obsidian + Git 双端同步
featured: false
draft: false
tags:
  - Obsidian
  - Cloudflare R2
  - PicList
  - Git
description: 使用 PicList 与 Cloudflare R2 搭建图床，并通过 Obsidian Git 实现 Windows 与 Android 双端同步。
---

## 01. 准备工作

### 工具

- [Obsidian](https://obsidian.md/)
- [PicList](https://piclist.cn/)
- [Cloudflare R2](https://www.cloudflare.com/)
- [GitHub](https://github.com/)
- [VS Code](https://code.visualstudio.com/)

## 02. Obsidian 配置 Git 自动同步

### 1. Windows 端

1. 创建一个 GitHub 私有仓库。
2. 配置 SSH 密钥。

```bash
ssh-keygen -t ed25519 -C "github邮箱"
cat ~/.ssh/id_ed25519.pub
```

3. 登录 GitHub。

   - 点击右上角头像 -> **Settings**
   - 在左侧菜单找到 **SSH and GPG keys**
   - 点击右上角 **New SSH key**
   - 填写 **Title** 和 **Key**
   - 点击 **Add SSH key**

4. 测试是否成功。

```bash
ssh -T git@github.com
```

5. 获取仓库的 SSH 地址。
6. 在 VS Code 中执行克隆。

```bash
git clone git@github.com:mistn/test_vault.git
```

7. 创建 .gitignore。

```text
.obsidian/workspace.json
.obsidian/workspace-mobile.json
```

8. 推送到 GitHub 仓库。

```bash
git add .gitignore
git commit -m "add obsidian gitignore"
git push origin main
```

![](https://s3.2731515.xyz/PicGo/20260131182036ipCuhA.webp)

测试成功。

9. 安装并配置 Obsidian 自动同步插件。

   - Obsidian 搜索 git

   ![](https://s3.2731515.xyz/PicGo/20260131182014uxWIlX.webp)

   - 停止编写一分钟后自动同步

   ![](https://s3.2731515.xyz/PicGo/20260131181951UujZ8k.webp)

   - 启动时自动拉取

   ![](https://s3.2731515.xyz/PicGo/20260131181934QisGbf.webp)

### 2. Android 端

1. 数据线连接手机并选择传输文件。
2. 直接复制 Obsidian 仓库到手机。
3. 手机端 Obsidian 打开文件夹。
4. Git 配置。

   - 打开 Git 插件，填写用户名和邮箱。
   - 配置 Personal Access Token。
     - 打开 GitHub。

     ![](https://s3.2731515.xyz/PicGo/20260131181906eNqtNU.webp)

     - 选择 No expiration。
     - 勾选 repo。
     - 填写 token。

## 03. Cloudflare R2 图床配置

### 1. 创建存储桶（Bucket）

- 登录 Cloudflare 控制台，在左侧菜单点击 **“存储与数据库” -> “R2”**。
- 点击 **“创建存储桶”（Create Bucket）**。

### 2. 获取 API 凭据（密钥）

- 在 R2 概览页面，点击右上角 **“管理 R2 API 令牌”（Manage API Tokens）**。
- 点击 **“创建 API 令牌”**，权限选择 **“对象读写”（Object Read & Write）**。
- 手动保存：
  - **Access Key ID**（访问密钥 ID）
  - **Secret Access Key**（机密访问密钥）
  - **Endpoint**（终结点 URL）

### 3. 开启公共访问

连接域并绑定子域名。

## 04. PicList 中配置 R2

### 1. 安装 s3-lls 插件

![](https://s3.2731515.xyz/PicGo/202601311818330xsoOR.webp)

### 2. 依次填写

![](https://s3.2731515.xyz/PicGo/20260131181750uzqSA8.webp)

### 3. 图床设置

- 高级重命名

  ```
  {Y}{m}{d}{h}{i}{s}{str-6}
  ```

- 移除 Exif 信息。
- 转换格式为 webp，压缩质量 85%。
- PicList 同步配置到 GitHub 仓库。

  ![](https://s3.2731515.xyz/PicGo/20260131180747fXkWsM.webp)

### 4. image auto upload 插件

![](https://s3.2731515.xyz/PicGo/20260131182309oHU5Hz.webp)

图片描述改为无。

### 5. mousewheel image zoom 插件

![](https://s3.2731515.xyz/PicGo/20260131182448XzaUB1.webp)

可以用鼠标调整图片大小。
