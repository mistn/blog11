---
author: miuo
pubDatetime: 2026-04-01T00:00:00+08:00
modDatetime: 2026-04-01T00:00:00+08:00
title: 部署 OpenList 聚合网盘
featured: false
draft: false
tags:
  - OpenList
  - 网盘
  - 部署
description: OpenList 部署与聚合网盘教程，包含 1Panel 安装、反向代理与存储挂载配置。
---

## 1. 前置

### 1.1 服务器

推荐 SSH 密钥
创建服务器时获取私钥文件

### 1.2 SSH 连接

推荐 [Termius](https://termius.com/index.html) 客户端

1. Keychain 导入私钥文件
![](https://s3.2731515.xyz/PicGo/20260403102941066qfk.webp)
2. NEW HOST 添加导入的私钥连接即可
![](https://s3.2731515.xyz/PicGo/20260403103105FW6wBA.webp)

## 2. 安装

### 2.1 1panel 安装

我个人选择 1panel 面板

- 脚本一键安装 1Panel
```
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```

登录面板

- 应用商店直接安装 Openlist 即可
![](https://s3.2731515.xyz/PicGo/20260403101732ahN8Q0.webp)

### 2.2 Docker 安装

参考官方[教程](https://doc.oplist.org.cn/guide/installation/docker)

### 2.3 反向代理

参考我的 [1panel 反向代理](/posts/1panel-reverse-proxy)

## 3. openlist 设置

> 容器列表点击 `终端` 按钮，进入容器内执行命令设置密码。
> **生成随机密码**: `./openlist admin random`
> **手动设置密码**: `./openlist admin set NEW_PASSWORD`

### 3.1 内部设置

- 可以修改密码和用户名
![](https://s3.2731515.xyz/PicGo/20260403104350IL6PxB.webp)
- [用户] -> [编辑] 按需修改权限
![](https://s3.2731515.xyz/PicGo/202604031047081iqCXP.webp)

### 3.2 添加存储

#### 3.2.1 以 Cloudflare R2 为例

- 驱动选择对象存储
- 挂载路径随意
- 参考我之前文章的 [R2 配置](/posts/obsidian-sync/#03-cloudflare-r2-%E5%9B%BE%E5%BA%8A%E9%85%8D%E7%BD%AE)选择存储桶，端点，地区，访问密钥ID，访问密钥
- **自定义主机**可以选择自己绑定在 R2 的域名
- 其余默认即可
挂载成功点击首页即可

#### 3.2.2 加密盘

加密盘驱动选择 Crypt，开启文件名加密，设置随机长密码和盐值，记得保存

#### 3.2.3 备份

备份与还原里，推荐按时备份
最终效果
![](https://s3.2731515.xyz/PicGo/20260403110452pUMeiA.webp)

## 4. 参考官方文档

- [Openlist](https://doc.oplist.org/)
- [1panel](https://1panel.cn/)
