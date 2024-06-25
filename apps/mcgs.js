export class FormulaPlugin extends plugin {
  constructor() {
    super({
      name: "鸣潮公式",
      dsc: "输出固定文本内容",
      event: "message",
      priority: 1050,
      rule: [
        {
          reg: "^鸣潮公式\\s+(\\S+)\\s+(\\S+)$",
          fnc: "outputContent",
        },
      ],
    });
  }

  async outputContent(e) {
    // 从消息中提取变量
    const match = e.msg.match(/^鸣潮公式\s+(\S+)\s+(\S+)$/);
    if (!match) return;

    const variable1 = match[1];
    const variable2 = match[2];

    // 构建回复消息
    const replyText = `${variable1} 是这样的。${variable2} 只要全身心投入到某活动，听命行事，努力某活动就可以。可是 ${variable1} 要考虑的事情就很多了。`;

    // 发送回复消息
    await e.reply(replyText);
  }
}
