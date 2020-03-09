---
layout: post_wide
title: "领 HNS 空投，买矿机，屯 BTC"
description: ""
keywords:   ""
category: blog
---

# 领 HNS 空投，买矿机，屯 BTC

Handshake Orgnization 融资以后，向 GNU、Mozilla 和其它互联网基金会捐赠了 10.2 亿美元，对于 GitHub 上，在 2019-02-04 那一周，你的 GitHub 账号有 15 个以上 followers 的开发者，使用当时的 SSH / PGP 私钥可以领取约 4200 个左右的 Handshake 币。

使用这些免费得来的 HNS，可以换成 BTC，换成 BTC 后，可以在 OTC 换成法币，或者购买矿机之类，挖更多 BTC 币了。

可以在比特袋鼠购买算力，或者支付电费，挖矿收益的年化大概 60% 左右，比直接换成 BTC 能多得到更多的比特币。

### 领取 HNS

需要做几个事情：

1. 打开 https://www.namebase.io ，点击右上角 Log In，使用 GitHub 账号登录；
2. 点击 verify 完成身份验证；
3. 领取，按照文档比较麻烦，安装过程比较繁琐，我构建了 docker 镜像，方便大家使用。

### 简洁步骤

打开「空投页面」： https://www.namebase.io/airdrop

```bash
git clone https://github.com/liaohuqiu/hs-airdrop
cd hs-airdrop
./get-airdrop 私钥路径 钱包地址 网络费率
```

1. 私钥路径是导入到 GitHub 的公钥对应的私钥。如果是 PGP key 的话，后面还要一个 id；
2. 地址在「空投页面」的第四步，有个按钮，点击获取：如下图，每次刷新，获取的地址都会变化，这个没关系；
3. 费率建议 0.01，我设置成 1。

<img src="https://srain-blog.android-gems.com/hs-airdrop/1.png"  width="640" height="auto">

SSH key 示例：

```
cd hs-airdrop
./get-airdrop ~/.ssh/id_rsa hs1qtjhjaru9xs2mm6kyu24d8e53rzm6n6pearmstr 1
```

PGP key 示例：

```
cd hs-airdrop
./get-airdrop ~/.gnupg/secring.gpg 0x12345678 hs1qtjhjaru9xs2mm6kyu24d8e53rzm6n6pearmstr 1
```

过程中输入 Passphrase，为空直接回车。最后会在最后展示一段 Base64，如图：


<img src="http://srain-blog.android-gems.com/hs-airdrop/2.png"  width="640" height="auto">

将它贴到「空投页面」第五步提交，如图：

<img src="https://srain-blog.android-gems.com/hs-airdrop/3.png"  width="640" height="auto">

提示成功：

<img src="https://srain-blog.android-gems.com/hs-airdrop/4.png"  width="640" height="auto">

然后提示成功，打开 https://www.namebase.io/dashboard 会显示有进行中的交易，16 个小时左右到帐。

<img src="https://srain-blog.android-gems.com/hs-airdrop/5.png"  width="640" height="auto">

### 换成 BTC

看好 HNS 的可以长期持有。我倾向于到帐后，可以换成 BTC，然后变现，或者投我熟悉的项目。换成 BTC：

1. 可以在 https://www.namebase.io/pro 直接交易成 BTC 然后转出。便捷，因为好多都是空投不要成本的在这出货，卖价格比市场价格低一些。
2. 可以转出到其它的交易所，价格高一些。如 [gate.io](https://www.gate.io/ref/395871)，价格比 namebase 高很多。

### 购买矿机挖矿

购买矿机挖矿相当于低价够买 BTC，矿机不短挖出 BTC，在价格合适的时候，卖出。所谓「熊市专心挖币，牛市卖出」。

1. [1Time.com](https://www.1tmine.com/mine/index?invite_id=1606572066732079)，推荐购买 M20s。
1. [比特袋鼠](https://www.btcroo.com?invite_key=qiubaiwan)，推荐购买 60 天的套餐。

