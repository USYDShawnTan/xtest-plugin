import Tools from "../../model/tools.js";

export class meiridaka extends plugin {
  constructor() {
    super({
      name: "打卡",
      dsc: "打卡",
      event: "message",
      priority: 1,
      rule: [
        {
          reg: "^#?(打卡|签到|冒泡)([\\s\\S]*)$",
          fnc: "每日打卡",
        },
      ],
    });
  }

  async 每日打卡(e) {
    // 获取用户ID
    const userId = e.user_id;

    // 获取当前日期
    const currentDate = await Tools.date_time();

    // 获取用户最后一次打卡日期
    let lastCheckInDate = await redis.get(`Yunz:DATE:${userId}`);
    lastCheckInDate = JSON.parse(lastCheckInDate);

    // 获取用户当前金币总数
    let totalCoins = await Tools.getCoins(userId);

    // 判断该用户的上一次打卡日期是否是今天
    if (currentDate === lastCheckInDate) {
      let msg = [
        segment.at(userId),
        `\n已经打过卡了喵~\n目前金币总数是${totalCoins}`,
      ];
      e.reply(msg);
      return;
    }

    // 用户今天第一次打卡
    const coins = Math.floor(Math.random() * 18) + 3; // 生成随机金币数，范围从3到20

    // 更新用户金币总数
    totalCoins = await Tools.addCoins(userId, coins);

    // 将当前日期写入redis，标记为今天已打卡
    await redis.set(`Yunz:DATE:${userId}`, JSON.stringify(currentDate));

    // 发送打卡成功的消息
    let msg = [
      segment.at(userId),
      `\n打卡成功喵~\n你获得了${coins}金币\n目前的金币总数是：${totalCoins}`,
    ];
    e.reply(msg);

    return true; // 结束运行
  }
}
