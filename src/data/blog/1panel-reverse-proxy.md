---
author: miuo
pubDatetime: 2026-03-15T00:00:00+08:00
modDatetime: 2026-03-15T00:00:00+08:00
title: 1Panel 反向代理
featured: false
draft: false
tags:
  - 1Panel
  - 反向代理
  - Nginx
description: 1Panel 反向代理实操记录，包含 Cloudflare DNS、证书申请与 HTTPS 配置步骤。
---

## 1. 域名

### 1.1 Cloudflare

我是在 Spaceship 买的域名托管到 Cloudflare

1. 点击[添加] -> [连接域]，选择[免费计划]
![](https://s3.2731515.xyz/PicGo/202604031113518OQtiB.webp)
2. 复制这两个
![](https://s3.2731515.xyz/PicGo/20260403111254PCnqi7.webp)

### 1.2 Spaceship

购买域名可以支付宝支付，6-7 位数字 xyz 域名 10 年 50 人民币左右

- 点击 [Launchpad]
- 选择[高级 DNS] -> [自定义名称服务器]
- 将 Cloudflare 的粘贴到这里
![](https://s3.2731515.xyz/PicGo/20260403112237VTEtBO.webp)
- 等待传播

## 2. 反向代理

### 2.1 申请证书

1. 创建 Acme 账号：
   - 点击左侧菜单[证书] -> [Acme 账号]
   - 点击[创建]，随便输入一个邮箱
2. 创建 DNS 账户
   - 登录 Cloudflare 控制台
   - 点击右上角的 [用户图标] -> [个人资料]
   - 点击[API 令牌] -> [创建令牌]
   - 找到[编辑区域 DNS] -> [使用模板]
   - [区域资源] -> [特定区域]选择目标域名即可
   - 复制保存 Token
3. 1panel 面板添加 DNS
   - [证书] -> [DNS 账号] -> [创建]
   - 填写 Token 即可
![](https://s3.2731515.xyz/PicGo/202604031158574JBzJx.webp)
4. 申请证书
   - 主域名：目标域名前加 `*.` 即可，例如 `*.example.com`

### 2.2 创建反向代理

#### 2.2.1 1panel

- 打开 1panel 面板 -> [网站] -> [创建] -> [反向代理]
- 主域名随意二级域名即可
- 代理地址 127.0.0.1:端口号
- [网站] -> [配置] -> [HTTPS]选择前面的证书

#### 2.2.2 Cloudflare

[DNS 记录]添加 A 记录，名称填上面的二级域名，IPV4 地址填服务器地址即可
