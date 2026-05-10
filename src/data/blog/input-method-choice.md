---
author: miuo
pubDatetime: 2026-02-20T00:00:00+08:00
modDatetime: 2026-02-20T00:00:00+08:00
title: 关于输入法和拼音方案的选择
featured: false
draft: false
tags:
  - 输入法
  - 双拼
  - 小鹤双拼
  - RIME
description: 记录双拼方案选择、小鹤双拼练习方法，以及 RIME 与雾凇拼音的安装配置。
---

## 1. 双拼方案

双拼方案我选择小鹤双拼，第一是泛用性，大部分输入法都进行了内置。第二是便利性，左右手分布均匀，分配合理。

### 1.1 双拼键位图

![](https://s3.2731515.xyz/PicGo/20260402103250iYicvD.webp)

### 1.2 记忆口诀

| Qiu | Wei | Ruan | T_ue_ve | Yun | U_shu | I_chi |
| :-- | :-- | :--- | :------ | :-- | :---- | :---- |
| 秋 | 闱 | 软 | 月 | 云 | 梳 | 翅 |

| Song | _iong | Dai | Fen | Geng | Hang | J_an |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 怂 | 恿 | 带 | 粉 | 更 | 航 | 安 |

| Kuai | _ing | Liang | _uang | Zou | Xia | _ua |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 快 | 迎 | 两 | 王 | 揍 | 夏 | 蛙 |

| Pie | Cao | V_zhui | _v | Bin | Niao | Mian |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 撇 | 草 | 追 | 鱼 | 滨 | 鸟 | 眠 |

### 1.3 个人练习方案

网站1记忆键位，网站2进一步熟悉。

1. https://www.keyspell.top/

![](https://s3.2731515.xyz/PicGo/20260402224055Ijmq3B.webp)

2. https://ninglo.github.io/shuangpin/

![](https://s3.2731515.xyz/PicGo/20260402223951N5RUwb.webp)

---

## 2. 输入法选择

基于隐私和个性化选择Windows端我选择[RIME小狼毫输入法](https://rime.im/download/)，[雾凇拼音词库](https://github.com/iDvel/rime-ice)。

### 2.1 RIME-Weasel安装

- 安装时建议不要修改用户文件夹位置，后续定制输入法容易出错。
- 不要有中文路径

### 2.2 雾凇拼音安装

Git 安装即可

```bash
git clone https://github.com/iDvel/rime-ice.git Rime --depth 1

# 更新
cd Rime
git pull
```

目前总练习时长一下午，基本熟练，本文全部小鹤双拼手打。
