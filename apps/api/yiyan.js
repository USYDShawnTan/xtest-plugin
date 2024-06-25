import fetch from "node-fetch";

export class api extends plugin {
  constructor() {
    super({
      name: "apis",
      // 功能描述
      dsc: "apis",
      event: "message",
      // 优先级,数字越小等级越高
      priority: 1045,
      rule: [
        {
          reg: "一言",
          fnc: "yy",
        },
        {
          reg: "骚话",
          fnc: "sh",
        },
        {
          reg: "情话",
          fnc: "qh",
        },
        {
          reg: "笑话",
          fnc: "xh",
        },
      ],
    });
  }

  async yy(e) {
    // API的URL
    const url = "https://api.vvhan.com/api/ian/wenxue";
    try {
      // 从API获取响应
      const response = await fetch(url);
      // 解析响应为文本
      const text = await response.text();

      // 将文本作为消息回复
      e.reply(text);
    } catch (error) {
      // 错误处理，发送错误消息
      e.reply("出错啦~稍后再试噢");
    }
  }

  async sh(e) {
    // API的URL
    const url = "https://api.vvhan.com/api/text/sexy";
    try {
      // 从API获取响应
      const response = await fetch(url);
      // 解析响应为文本
      const text = await response.text();

      // 将文本作为消息回复
      e.reply(text);
    } catch (error) {
      // 错误处理，发送错误消息
      e.reply("出错啦~稍后再试噢");
    }
  }
  async qh(e) {
    // API的URL
    const url = "https://api.vvhan.com/api/text/love";
    try {
      // 从API获取响应
      const response = await fetch(url);
      // 解析响应为文本
      const text = await response.text();

      // 将文本作为消息回复
      e.reply(text);
    } catch (error) {
      // 错误处理，发送错误消息
      e.reply("出错啦~稍后再试噢");
    }
  }
  async xh(e) {
    // API的URL
    const url = "https://api.vvhan.com/api/text/joke";
    try {
      // 从API获取响应
      const response = await fetch(url);
      // 解析响应为文本
      const text = await response.text();

      // 将文本作为消息回复
      e.reply(text);
    } catch (error) {
      // 错误处理，发送错误消息
      e.reply("出错啦~稍后再试噢");
    }
  }
}
