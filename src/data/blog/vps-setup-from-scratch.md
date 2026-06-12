---
author: miuo
pubDatetime: 2026-06-11T00:00:00+08:00
modDatetime: 2026-06-11T00:00:00+08:00
title: 从零开始的 VPS 生活
featured: false
draft: false
tags:
  - VPS
  - Azure
  - Debian
  - 1Panel
  - 安全
description: 从 Azure 创建虚拟机到 1Panel 面板配置、服务器安全加固与优化的完整记录。
---

## 1. Azure 创建虚拟机

- **创建资源 > 虚拟机**

![](https://s3.2731515.xyz/PicGo/20260611195857a2dex3.webp)

- **区域** > **East Asia**，**映像** > **Debian 12**，端口开放 22 和 443

![](https://s3.2731515.xyz/PicGo/20260611201030NrgNf4.webp)

- 保存好下载的 pem 私钥文件

![](https://s3.2731515.xyz/PicGo/20260611202030gWrWQd.webp)

## 2. Termius 设置

### 2.1 连接服务器

- 按序号直接拖入之前下载的私钥文件

![](https://s3.2731515.xyz/PicGo/20260611202750lrBs2h.webp)

- Address 填写服务器 ip ，Username 输入创建时的用户名，Keys 选择刚才导入的密钥，点击 connect 连接

![](https://s3.2731515.xyz/PicGo/20260611203203rvYdcq.webp)

- 成功进入终端

![](https://s3.2731515.xyz/PicGo/20260611203304eLyDUm.webp)

### 2.2 安装 1Panel 面板

- 第一步：切换到 root 用户

```Bash
sudo -i
```

- 第二步：更新系统并安装基础依赖

```Bash
apt update -y && apt upgrade -y
apt install curl wget sudo -y
```

- 第三步：运行 1Panel 一键安装脚本

```Bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && bash quick_start.sh
```

### 2.3 Azure 添加入站端口规则

**网络设置 > 创建端口规则 > 入站端口规则 > 目标端口范围**
填入刚才在 1Panel 安装时生成的面板端口号

## 3. 1Panel 初始设置

### 3.1 安装 openresty

![](https://s3.2731515.xyz/PicGo/20260611205416sk5ChK.webp)

### 3.2 创建反向代理

![](https://s3.2731515.xyz/PicGo/20260611205608Mc3iuC.webp)

### 3.3 Cloudflare 添加 DNS 记录

![](https://s3.2731515.xyz/PicGo/20260611205933xSbhBX.webp)

### 3.4 Cloudflare 申请证书

- 选择**编辑区域 DNS** 的令牌模板
- 区域资源选择要申请证书的域名
- 创建后记得保存 Cloudflare API，因为退出后不再显示

![](https://s3.2731515.xyz/PicGo/20260611210502Rk0uEI.webp)

- 接下来返回1Panel，点击**证书 > DNS 账户**
- 按图依次填写

![](https://s3.2731515.xyz/PicGo/20260611211020MmZHUT.webp)

### 3.5 创建 Acme 账户

![](https://s3.2731515.xyz/PicGo/202606112112511vF799.webp)

### 3.6 申请证书

**主域名**选择 `*.+域名`

![](https://s3.2731515.xyz/PicGo/20260611211733129pSJ.webp)

### 3.7 设置 HTTPS

选择刚刚设置的证书

![](https://s3.2731515.xyz/PicGo/20260611211931MGgJJu.webp)

### 3.8 面板域名提醒

> [!tip]
> 面板绑定域名记得加 Termius 里安装面板出现的安全入口后缀

## 4. 服务器安全

### 4.1 安装 Fail2ban

```Bash
# 1. 更新软件源并同时安装 fail2ban 和 rsyslog（-y 表示自动确认运行）
sudo apt-get update && sudo apt-get install fail2ban rsyslog -y

# 2. 启动 Fail2ban 服务
sudo systemctl start fail2ban

# 3. 设置开机自启，保证服务器重启后依然生效
sudo systemctl enable fail2ban

# 4. 重启系统日志服务，确保 Fail2ban 能读到最新的日志
sudo systemctl restart rsyslog
```

查看运行状态

```Bash
sudo systemctl status fail2ban
```

### 4.2 开启面板两步验证

**面板 > 安全 > 两步验证**
推荐 Google Authenticator 和 Bitwarden

![](https://s3.2731515.xyz/PicGo/20260611213825oZaqct.webp)

### 4.3 安装 ufw

- 更新包列表并安装 UFW：

```Bash
sudo apt update && sudo apt install ufw -y
```

- 放行 SSH 端口

```Bash
sudo ufw allow 22/tcp
```

- 放行建站必须的 Web 端口

```Bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

- 放行 1Panel 面板专属端口
`12345` 替换成刚才安装 1Panel 时设置的真实端口号

```Bash
sudo ufw allow 12345/tcp
```

- 启动并激活 UFW

```Bash
sudo ufw enable
```

- 检查运行状态

```Bash
sudo ufw status verbose
```

### 4.4 修改默认的 22 端口

1. 在 Azure 面板放行新端口
找一个随机高位端口**添加入站端口规则**

2. 在 1Panel 面板放行新端口

![](https://s3.2731515.xyz/PicGo/20260611215330Tsl4wO.webp)

3. 修改 SSH 配置文件

```Bash
sudo nano /etc/ssh/sshd_config
```

在文件里往下找，找到 `#Port 22` 这一行
把前面的 `#`（注释符）删掉，并把 `22` 改成的新端口，变成：

```Bash
Port 54321
```

按 `Ctrl + O` 保存，敲回车确认文件名，然后按 `Ctrl + X` 退出编辑器

4. 重启 SSH 服务让配置生效：

```Bash
sudo systemctl restart ssh
```

5. 删除 22 端口

## 5. 安装应用

### 5.1 安装 komari 探针

默认端口 25774 ，进行反向代理

![](https://s3.2731515.xyz/PicGo/20260611221920NwyBdx.webp)

![](https://s3.2731515.xyz/PicGo/20260611225058WiMVLp.webp)

### 5.2 后续补充

## 6. 服务器优化

### 6.1 开启虚拟内存（Swap）

打开 1Panel 面板 > 左侧菜单点击 **工具箱** > 选择 **快速设置**

设置 2048 MB

![](https://s3.2731515.xyz/PicGo/20260611224027FCFkhr.webp)

### 6.2 开启 BBR 拥塞控制算法

```Bash
echo "net.core.default_qdisc=fq" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

验证

```Bash
sudo sysctl net.ipv4.tcp_congestion_control
```

### 6.3 校准服务器时区

```Bash
sudo timedatectl set-timezone Asia/Shanghai
```

## 7. 服务器备份

### 7.1 添加 WebDav

**面板设置 > 备份账号 > 添加 WebDav**

![](https://s3.2731515.xyz/PicGo/20260611220956K1f3LY.webp)

>推荐 [Infini-Cloud](https://infini-cloud.net/en/index.html) ，注册免费 20 GB 空间

My Page 页面图中三个照填即可

![](https://s3.2731515.xyz/PicGo/2026061122131261QSCW.webp)

### 7.2 添加计划任务

应用计划备份

![](https://s3.2731515.xyz/PicGo/20260611225914lE3T0I.webp)
