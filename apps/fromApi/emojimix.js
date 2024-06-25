import fetch from "node-fetch";

export class xgn extends plugin {
  constructor() {
    super({
      name: "emoji合成",
      dsc: "emoji合成",
      event: "message",
      priority: 1045,
      rule: [
        {
          reg: /\p{Emoji_Presentation}{2}$/gu,
          fnc: "bqhc",
        },
      ],
    });
  }

  async bqhc(e) {
    let emojis = e.msg.match(/\p{Emoji_Presentation}/gu);
    if (emojis.length !== 2) {
      e.reply("请输入两个emoji进行合成。");
      return;
    }
    let firstEmoji = emojis[0].codePointAt(0).toString(16);
    let secondEmoji = emojis[1].codePointAt(0).toString(16);
    let dates = [
      "20201001",
      "20211115",
      "20210521",
      "20230301",
      "20220506",
      "20221101",
      "20230126",
      "20230803",
      "20230418",
    ]; // 可以添加更多日期以尝试
    let combinations = [
      [firstEmoji, secondEmoji],
      [secondEmoji, firstEmoji],
    ];

    for (let date of dates) {
      for (let [emoji1, emoji2] of combinations) {
        let url = `https://www.gstatic.com/android/keyboard/emojikitchen/${date}/u${emoji1}/u${emoji1}_u${emoji2}.png`;
        try {
          let res = await fetch(url);
          if (res.ok) {
            let msg = segment.image(url);
            e.reply(msg);
            return; // 成功后退出循环
          }
        } catch (error) {
          console.error(`请求出错，日期: ${date}`, error);
        }
      }
    }
    e.reply("抱歉，这两个emoji不能合成噢~");
  }
}
