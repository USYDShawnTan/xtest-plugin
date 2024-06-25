// 设置触发关键词
const regKeywords = `^#?(留言|ly|提醒|tx)`;
const regKeywordsFull = new RegExp(regKeywords);

export class example extends plugin {
  constructor() {
    super({
      name: "留言插件",
      dsc: "留言给群友",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: regKeywords,
          fnc: "liuyan",
        },
      ],
    });
  }

  async liuyan(e) {
    const thisMsg = e.message;
    const thisMsgSenderQQ = e.sender.user_id;
    const thisMsgSenderNickname =
      e.sender.card || e.sender.nickname || e.nickname || e.user_id;
    let thisMsgWillSendToQQ = null;

    // 定义变量
    const willSendMessage = [];
    let haveFirstAt = false;
    let haveFirstKeyword = false;

    // 遍历消息的每一条内容
    for (const msg of thisMsg) {
      // 获取第一个at的qq号，肯定是目标QQ
      if (!haveFirstAt && msg.type === "at") {
        thisMsgWillSendToQQ = msg.qq;
        haveFirstAt = true;
        continue;
      }
      // 忽略第一个关键词
      if (msg.type === "text" && !haveFirstKeyword) {
        if (msg.text.match(regKeywordsFull)) {
          msg.text = msg.text.replace(regKeywordsFull, "");
          haveFirstKeyword = true;
        }
      }
      if (msg.text !== "") {
        willSendMessage.push(msg);
      }
    }

    if (!haveFirstAt) {
      e.reply("使用格式：留言@xxx xxxx");
      return;
    }

    // 构造转发消息
    const fakeMsg = [];
    if (willSendMessage.length !== 0) {
      fakeMsg.push({
        user_id: thisMsgSenderQQ,
        message: willSendMessage,
        nickname: thisMsgSenderNickname,
      });
    }

    if (fakeMsg.length === 0) {
      return;
    }

    // 获取现有的留言
    const tempKey = `Yunz:ly:${thisMsgWillSendToQQ}`;
    const existingMessagesJson = await redis.get(tempKey);
    const existingMessages = existingMessagesJson
      ? JSON.parse(existingMessagesJson)
      : [];

    // 追加新的留言
    const obj = existingMessages.find(
      (item) =>
        item.targetUserQQ == thisMsgWillSendToQQ &&
        item.senderQQ == thisMsgSenderQQ
    );
    if (!obj) {
      existingMessages.push({
        targetUserQQ: thisMsgWillSendToQQ,
        senderQQ: thisMsgSenderQQ,
        senderNickname: thisMsgSenderNickname,
        result: fakeMsg,
      });
      e.reply("新建留言成功!");
    } else {
      obj.result = obj.result.concat(fakeMsg);
      e.reply("追加留言成功!");
    }

    // 将留言存储到 Redis
    await redis.set(tempKey, JSON.stringify(existingMessages));
  }
}

// 全局监听消息
Bot.on("message", async (e) => {
  if (!e.group) {
    return;
  }

  const userId = e.sender.user_id;
  const tempMessagesJson = await redis.get(`Yunz:ly:${userId}`);
  const tempMessages = tempMessagesJson ? JSON.parse(tempMessagesJson) : [];

  if (tempMessages.length > 0) {
    for (const message of tempMessages) {
      await e.reply(`${message.senderNickname}给你留言：`, true);
      await e.reply(e.group.makeForwardMsg(message.result));
    }
    // 删除已发送的留言
    await redis.del(`Yunz:ly:${userId}`);
  }
});
