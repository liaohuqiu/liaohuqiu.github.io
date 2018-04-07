---
layout: post_wide
title: "一次白帽黑客挑战赛"
description: ""
keywords:   ""
category: blog
---

### 赛制与规则说明

本项目所有的代码和相关资料在 [GitHub 上](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/README.md)，这个是 [本次挑战赛的规则](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/README.md
)，如果不了解本次挑战赛的读者，请先阅读规则。

### 规则解说

1. 重生次数，首次破解时间很重要。

2. 成绩和报名账户的收入和成本相关。

3. 规则不限。

4. 48 小时，北京时间 2018 年 4 月 4 号 15:00 到 6 号 15:00。

### 代码解读

* 30 分钟限制：每 30 分钟才可取钱

* 16 小时限制：`selfdestruct()` 在 `lastUpdated` 16 小时才后可攻击，`addToReserve()` 可更新 `lastUpdated`。

  这使得很多操作在比赛期间只能操作 2 次。

* `GameVerifier` 控制权限，`addGamer()` 可添加新地址，需要知道第二个参数的取值规律。

* `TimeDelayedVault` 和 `CommonWalletLibrary`

    * `withdrawFund()` 非常容易构造 `reentry`，麻烦的是要团队配合投票。
    *  构造函数中 `initializeVault` 是个笔误，无法调用成功 `initilizeVault()`，部署完后，所有合约都是没有 owner 的。
    *  owner 可调用 `resolve()`，在 `lastUpdated` 后 16 个小时销毁合约，余额会转到 owner 对应的地址。

### 攻防分析

* 最简单的，`reentry` 除去 gas，收入不多。这个越早越好，简单易行，主要考验团队配合。

* `addGamer()` 可添加**非报名地址**，用于各种攻防操作，防追踪。同时可通过 `addToReserve()` 加钱，增加收益。

* 抢占 owner，然后等时间到，`resolve()` 收钱；但任何人都可调用 `addToReserve()` 阻止。

### 分工

我们是 3 期 C 组。参加的同学有: WYF，BJ，LJW，LYN，XCY，和我。BJ 因为要赶之前作业，过程没参与，LYN 同学是后半段参与的。

* WYF 是队长，不过赛期他东京回国，事情也多，没办法实时在线。他应该是组内比较了解智能合约的同学，大策略都是他出的主意。

* LJW 和 XCY 在线时间多，不过 XCY 同学好像是在美西。

* 我飞机晚点 4 号凌晨到北京，有几个应酬，还要陪女朋友不能整天待电脑前面，6 号早 6 点飞杭州，在线时间不也多。

### 本组攻防过程

##### 1. 抢占 owner

4 号早上起来，写了一会工作代码，下午比赛开始之后，简单看了除 reentry 没想到其它办法（新手视野不广），琢磨一个多小时，组里没什么动静，去参加一个饭局。

4 号晚，WYF 在群里说检查合约的 `initilizeVault()` 调用了没，要抢，我喝酒喝得晕乎乎的，没理解。洗澡的时候，突然警醒。和 WYF 同学电话沟通了一下，检查[所有合约](https://ropsten.etherscan.io/address/0x5138da08c878ec23b82b85a86eca47230f96f62b) 发现有部分合约已经被抢占，`CommonWalletLibrary` 也被抢占。

迅速写了 [代码](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/src/init.js)，把能抢占的都抢占了，组内简单同步，然后睡觉去了。

早上醒来，WYF 同学说给 `CommonWalletLibrary` 续命了，花了 3 个 eth，这个钱要赚回来。上午要出门陪女朋友看电影，结束大概是抢占 owner 之后的 16 小时，写好了 [检查可 `resolve()` 合约的代码](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/src/check.js) 和 [调用 `resolve()` 的代码](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/src/kill.js)，然后出门了。

电影不错。

回来之后，留了一个合约没收割（后面发现还漏了一个），其它控制的合约全销毁了，收获大概 20 个 eth，发现大群里有一些动静。

这时候时间过去一半，时间系数 0.5。

监控发现又有组重生，迅速占领。

##### 2. 攻占 GameVerifier

想要扩大战果，靠 `reentry` 和 `resolve()` 是不行的。要破解 `addGamer()` 大量加强，然后 `reentry`。当时我们 `reentry` 还没实现。晚上大家电话会议，确定分工如下：

* LJW 同学实现 `reentry`，并负责调度大家 `addAuthorizedAccount()`

* XCY 和我复杂攻占 `addGamer()`。

WYF 和我用 MEW 调用测试 magic num，发现 1 是不行的，但是看 input data 以及 porosity 反编译出来的都是 1，不解，决定看 opcode。

Opcode 用了对比法，我写了一个没任何验证的 `GameVerifier`，将 [它的 opcode](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/opcodes/without-check.txt) 和 [部署在链上的 `GameVerifier` 的 opcode](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/opcodes/origin.txt) 做了对比。

> 比赛结束后发现，结果和 porosity 反编译出来是一致的。即:

> ```
> function addGamer(address,uint256) {
>       if (!msg.value) {
>       }
>       if ((arg_24 == 0x100000)) {
>          store[var_Rtj0D] = 0x1;
>          return;
>       }
>       store[var_Rtj0D] = 0x1;
>       return;
> }
> ```

> 是用 MEW 调用的问题，用 web3 调用即可。

##### 3. 跳板合约和傀儡合约

到了晚上 12 点左右，对着黄皮书看 opcode，眼睛都要瞎了，WYF 提出了一个疯狂的想法：

随便构造一个合约，用非报名帐号给这个合约充钱，然后销毁这个合约（跳板合约），把钱转给竞赛的合约（傀儡合约，其它组的和我们自组的），然后销毁傀儡合约。

立刻简单测试，可行：

```
contract Jumper {
    address vault;
    address owner;

    function Jumper() payable {
        owner = msg.sender;
    }

    function setVault(address v) {
        require(msg.sender == owner);
        vault = v;
    }

    function addFund() payable returns(uint) {
        return this.balance;
    }

    function kill() {
        require(msg.sender == owner);
        selfdestruct(vault);
    }
}
```

> 这个代码是 XCY 同学写的，我写的版本非常简陋。他这个版本很好：

> 1. 因为局势随时变化，很可能给这个跳板合约充了钱，要 kill 的时候，发现傀儡合约不能销毁了，`setVault()` 保证了灵活性。

> 2. 这次功防，很大一部分是 owner 造成的。这个合约 owner 处理得很好。

因为明早 4 点多要起来赶航班，大家同步完，做了分工：

* XCY 在美西，他请假一天，继续破解 `addGamer()`
* 大家都屯币
* 我去睡觉，防止猝死

##### 4. 快速致富

早上起来，车车同学（XCY）传来好消息：

1. addGamer 的 magic number 就是 1。
2. 他屯了 500  个币了。

时间是北京时间 6 点多，其它同学都还没醒，没同步沟通。

不过这个时候我和 XCY 同学交流，更倾向于用跳板合约攻击了。

考虑到其他组可能也想到这个方案，取胜的方案是比谁可以快速拿到大量的 eth。

在北京首都机场写了[快速刷币的脚本](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/src/request-eth.py)。将地址放入到脚本中，多个线程并发调用，faucet 对单 IP 有请求数限制，本身网站并发能力也有限，动不动就挂。每个帐号有 10 个 eth 之后，就不能再申请，需要把钱转走。

落地杭州后，在去办公室的路上，尝试写自动转钱脚本，简单的 transfer 一直没调试成功，人差点被彪悍的司机颠吐……

到了办公室 9 点多，大家电话同步，形成决议：

**用跳板合约攻击，手头可用的傀儡合约是 5 个左右（实际 6 个），分批多个批次行动**。

这里有一个权衡，因为目前我们手头没很多币，如果：

1. 第一笔钱到帐之后，我的帐号是被一直监控的，活跃的团队还有好几个，风险是我们控制的剩余合约可能被续命，好处是立刻行动至少还会立刻可拿到收益。

2. 等攒够足够多的钱，几个小时之后，比如到 1w 个 eth 的时候，再进行操作。风险是到后来可能一个可用的合约都没了，好处是早期不会惹人注意可一次拿下。

很多时候，基于一个情况，是没一个最优解的，团队合作的要诀是形成一个决定，然后坚决执行。

于是大家都去攒币，10 点半左右完成第一波 1000 个 eth 入帐；又过了 1 个小时，大家手工刷的 2000 个 eth 准备好了，再次入帐。

这个我的 [自动转账脚本](https://github.com/liaohuqiu/cube-box/blob/master/src/challenge/src/transfer-eth.js) 也完成了，LJW 和 LYN 把他们的地址和私钥给我，我一个小时不到，攒了 3000 多个，于是完成了第三次入帐。

钱都是转到 XCY 同学帐号，他操作跳板合约到傀儡合约，我负责杀死傀儡合约拿到钱。

最后一波想到 10000，每个 IP 有并发限制，我动用了相关阿里云 6 个机器，将 100 来个帐号，分成 6 组，但由于并发量太大，faucet 被撸挂了。

faucet 挂了大概 20 分钟后，监控发现，没有可用的合约了，收工，最终战果： [将近 7000 个 eth](https://ropsten.etherscan.io/address/0xd48a0ff0c1555ce2e85a0f456ab461e17516d4e6)。

下午两点左右，杭州的天气不错，希望你那里也是一样。

不一会，老董到群里祝贺我们，并建议我们不要刷 faucet，影响不好，说刷那么多币干嘛——原来他自己都没想到可以用跳板合约这样的方式进行攻击的，^_*

事情就这么个事情，整个过程还有一些可提升的地方，但大家已经表现得很不错的，和这样的队友在一起，感觉很棒。我玩得很开心，希望队友们也是，^_^

##### 5. 总结

最终我们组拿了第一，撒花庆祝。颁发了一个 MVP 的奖给我，但实际真是当之有愧，自己有几斤几两还是很清楚的，你看，我连朋友圈都没好意思发……

总结下来，成功因素有:

1. 聪明，很多好想法是 WYF 同学提出来的，他接触智能合约时间也不长，这个小伙子很有天赋。我也曾努力琢磨，但却没什么好想法——只有努力过才知道，天分有多么重要。

2. 勤奋，团队是 48 小时连轴转的。大部分的同学 48 个小时是一直参与的，尤其刷币的时候，全靠努力——嗯，全靠体力。

3. 团队协作。单枪匹马，匹夫之勇是行不通的：个人力量和团队的力量较量，无异于以卵击石。战斗时期的团队协作，沟通，决策，执行步步不能差。

4. 运气，遇上给力的队员，确实是好运，哈哈。

---

本文是在 3 期结业典礼上的复盘发言。
