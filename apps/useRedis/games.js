import Tools from "../../utils/tools.js";

export class GamePlugin extends plugin {
  constructor() {
    super({
      name: "游戏插件",
      dsc: "饥饿值、种地、挖矿、造房子、打架",
      event: "message",
      priority: 1,
      rule: [
        {
          reg: "^#?(种地)$",
          fnc: "farm",
        },
        {
          reg: "^#?(挖矿)$",
          fnc: "mine",
        },
        {
          reg: "^#?(造房子)$",
          fnc: "buildHouse",
        },
        {
          reg: "^#?(打架)$",
          fnc: "fight",
        },
        {
          reg: "^#?(查看状态)$",
          fnc: "checkStatus",
        },
      ],
    });
  }

  async farm(e) {
    const userId = e.user_id;
    const hunger = await Tools.getHunger(userId);

    if (hunger < 5) {
      e.reply("你的饥饿值不足，无法种地，请先恢复饥饿值。");
      return;
    }

    await Tools.addHunger(userId, -5);
    const gainedHunger = Math.floor(Math.random() * 8) + 1;
    const totalHunger = await Tools.addHunger(userId, gainedHunger);

    if (Math.random() < 0.1) {
      await Tools.addHunger(userId, 20 - totalHunger);
      e.reply("你种地获得了饱食度，饥饿值已满！");
    } else {
      e.reply(
        `你种地获得了${gainedHunger}饥饿值，你现在的饥饿值为${totalHunger}`
      );
    }
  }

  async mine(e) {
    const userId = e.user_id;
    const hunger = await Tools.getHunger(userId);

    if (hunger < 8) {
      e.reply("你的饥饿值不足，无法挖矿，请先恢复饥饿值。");
      return;
    }

    await Tools.addHunger(userId, -8);
    const gainedStones = Math.floor(Math.random() * 11) + 10;
    const totalStones = await Tools.addStones(userId, gainedStones);

    if (Math.random() < 0.1) {
      e.reply(`你挖矿获得了${gainedStones}块石头，并发现了一块黄金！`);
    } else {
      e.reply(
        `你挖矿获得了${gainedStones}块石头，你现在共有${totalStones}块石头。`
      );
    }
  }

  async buildHouse(e) {
    const userId = e.user_id;
    const stones = await Tools.getStones(userId);

    if (stones <= 0) {
      e.reply("你没有足够的石头来造房子，请先挖矿。");
      return;
    }

    const totalArea = await Tools.addArea(userId, stones);
    await Tools.addStones(userId, -stones);
    e.reply(
      `你用${stones}块石头造了${stones}平方米的房子，你现在共有${totalArea}平方米的房子。`
    );
  }

  async fight(e) {
    const userId = e.user_id;
    const atTargets = e.message.filter((msg) => msg.type === "at");

    if (atTargets.length === 0) {
      e.reply("请@一个要打架的对象。");
      return;
    }

    const targetId1 = atTargets[0].qq;
    const targetId = parseInt(targetId1, 10);
    if (userId === targetId) {
      e.reply("你不能和自己打架！");
      return;
    }

    const userHunger = await Tools.getHunger(userId);
    if (userHunger < 10) {
      e.reply("你的饥饿值不足，无法打架，请先恢复饥饿值。");
      return;
    }

    const targetHunger = await Tools.getHunger(targetId);
    if (targetHunger < 5) {
      await Tools.addHunger(targetId, -targetHunger);
    } else {
      await Tools.addHunger(targetId, -5);
    }

    await Tools.addHunger(userId, -10);

    const userNickname =
      e.sender.card || e.sender.nickname || e.nickname || e.user_id;
    const targetInfo = await e.group.pickMember(targetId);
    const targetNickname = targetInfo.card || targetInfo.nickname || targetId;

    const isWin = Math.random() < 0.5;

    if (isWin) {
      const targetStones = await Tools.getStones(targetId);

      await Tools.addStones(userId, targetStones);
      await Tools.addStones(targetId, -targetStones);

      e.reply(
        `「${userNickname}」打败了「${targetNickname}」，抢走了「${targetStones}」块石头！`
      );
    } else {
      const userStones = await Tools.getStones(userId);

      await Tools.addStones(targetId, userStones);
      await Tools.addStones(userId, -userStones);

      e.reply(
        `「${targetNickname}」打败了「${userNickname}」，抢走了「${userStones}」块石头！`
      );
    }
  }

  async checkStatus(e) {
    const userId = e.user_id;
    const hunger = await Tools.getHunger(userId);
    const stones = await Tools.getStones(userId);
    const area = await Tools.getArea(userId);

    e.reply(
      `你的状态：\n饥饿值：${hunger}\n石头：${stones}\n房子面积：${area}平方米`
    );
  }
}

export default new GamePlugin();
