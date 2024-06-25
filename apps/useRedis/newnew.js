import Tools from "../../utils/tools.js";

export class StickPlugin extends plugin {
  constructor() {
    super({
      name: "金箍棒",
      dsc: "管理金箍棒长度",
      event: "message",
      priority: 1,
      rule: [
        {
          reg: "^#?(领养金箍棒)$",
          fnc: "adoptStick",
        },
        {
          reg: "^#?(查看金箍棒)$",
          fnc: "viewStick",
        },
        {
          reg: "^#?(PK|pk|击剑)",
          fnc: "pkStick",
        },
        {
          reg: "^#?(快快变大)$",
          fnc: "buyStickLength",
        },
      ],
    });
  }

  async adoptStick(e) {
    const userId = e.user_id;
    let length = await Tools.getStickLength(userId);

    if (length !== null) {
      e.reply("不是哥们！你想要两根？不给！！");
      return;
    }

    length = await Tools.initStickLength(userId);
    e.reply(`你成功领养了一根金箍棒，初始长度为${length}厘米。`);
  }

  async viewStick(e) {
    const userId = e.user_id;
    let currentLength = await Tools.getStickLength(userId);

    if (currentLength === null) {
      e.reply("你还没有领养金箍棒，请先发送“领养金箍棒”进行领养。");
      return;
    }

    e.reply(`你的金箍棒现在的长度是${currentLength}厘米。`);
  }

  async pkStick(e) {
    const userId = e.user_id;
    const atTargets = e.message.filter((msg) => msg.type === "at");

    if (atTargets.length === 0) {
      e.reply("请@一个要PK的对象，有时候复制粘贴的at不可以噢，要手动at一下");
      return;
    }

    const targetId = atTargets[0].qq;
    const targetIdNum = parseInt(targetId, 10);
    if (userId === targetIdNum) {
      e.reply("不是哥们？你能再逆天点吗？金箍棒不允许私用的");
      return;
    }

    // 获取用户的名片或昵称
    const userNickname =
      e.sender.card || e.sender.nickname || e.nickname || e.user_id;

    // 获取目标用户的名片或昵称
    const targetInfo = await e.group.pickMember(targetIdNum);
    const targetNickname =
      targetInfo.card || targetInfo.nickname || targetIdNum;

    let userLength = await Tools.getStickLength(userId);
    let targetLength = await Tools.getStickLength(targetId);

    if (userLength === null) {
      e.reply("你还没有领养金箍棒，请先发送“领养金箍棒”进行领养。");
      return;
    }

    if (targetLength === null) {
      e.reply(`「${targetNickname}」还没有领养金箍棒。`);
      return;
    }

    const lengthToChange = parseFloat(Math.random() * 4 + 1); // 随机长度，范围从1到5
    const userWin = Math.random() < 0.5; // 50% 几率决定输赢

    let userNewLength, targetNewLength;

    if (userWin) {
      userNewLength = await Tools.addStickLength(userId, lengthToChange);
      targetNewLength = await Tools.addStickLength(targetId, -lengthToChange);
      e.reply(
        `「${userNickname}」把「${targetNickname}」狠狠的爆锤一顿\n「${userNickname}」的金箍棒变长了${lengthToChange}厘米，\n现在的长度是${userNewLength}厘米。\n「${targetNickname}」的金箍棒变短了${lengthToChange}厘米，\n现在的长度是${targetNewLength}厘米。`
      );
    } else {
      userNewLength = await Tools.addStickLength(userId, -lengthToChange);
      targetNewLength = await Tools.addStickLength(targetId, lengthToChange);
      e.reply(
        `「${targetNickname}」把「${userNickname}」狠狠的爆锤一顿\n「${userNickname}」的金箍棒变短了${lengthToChange}厘米，\n现在的长度是${userNewLength}厘米。\n「${targetNickname}」的金箍棒变长了${lengthToChange}厘米，\n现在的长度是${targetNewLength}厘米。`
      );
    }
  }

  async buyStickLength(e) {
    const userId = e.user_id;
    const cost = 5; // 固定花费5金币
    try {
      let result = await Tools.consumeCoins(userId, cost);
      let coins = await Tools.getCoins(userId);
      if (result.success) {
        const randomValue = Math.random();
        let lengthToAdd = 0;
        let message = "";

        if (randomValue < 0.1) {
          // 10%的概率变为0
          lengthToAdd = 0;
          message = `很遗憾，你的金箍棒变成了0厘米。`;
        } else if (randomValue < 0.5) {
          // 40%的概率增加5-10厘米
          lengthToAdd = parseFloat(Math.random() * 5 + 5);
          message = `恭喜！你的金箍棒增加了${lengthToAdd}厘米。`;
        } else if (randomValue < 0.8) {
          // 30%的概率不变
          lengthToAdd = 0;
          message = `不好意思噢~你的金箍棒长度木有任何变化。`;
        } else {
          // 20%的概率变短5-10厘米
          lengthToAdd = -parseFloat(Math.random() * 5 + 5);
          message = `hiahia剪短！${-lengthToAdd}厘米。`;
        }

        let newLength = await Tools.addStickLength(userId, lengthToAdd);
        e.reply(
          `改一次五块钱，拿来吧你！剩余金币：${coins}\n${message}\n现在的长度是${newLength}厘米。`
        );
      } else {
        e.reply(`你的金币不足，当前金币：${result.totalCoins}。`);
      }
    } catch (err) {
      e.reply("你还没有领养金箍棒，请先发送“领养金箍棒”进行领养。");
    }
  }
}

export default new StickPlugin();
