import schedule from "node-schedule";
let groupnumber_list = ["103382278", "865913474"];
let url = "https://api.jun.la/60s.php?format=image";

export class news extends plugin {
  constructor() {
    super({
      name: "新闻",
      dsc: "每日60秒新闻,数据来自《每天60秒读懂世界》公众号",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#?新闻.*$",
          fnc: "news",
        },
      ],
    });
  }

  async news(e) {
    e.reply(segment.image(url));
    return true;
  }
}

schedule.scheduleJob("0 0 8 * * ?", async () => {
  console.log("新闻推送送达");
  for (var i = 0; i < groupnumber_list.length; i++) {
    let group = Bot.pickGroup(groupnumber_list[i]);
    group.sendMsg(segment.image(url));
    group.sendMsg("☀️早上好噢~\n📰今日新闻已送达~");
  }
});

schedule.scheduleJob("0 0 0 * * ?", async () => {
  console.log("通知");
  for (var i = 0; i < groupnumber_list.length; i++) {
    let group = Bot.pickGroup(groupnumber_list[i]);
    group.sendMsg("🌙晚安安群友们~新的一天了噢，可以打卡啦");
  }
});
