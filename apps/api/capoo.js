export class example extends plugin {
  constructor() {
    super({
      name: "随机咖波表情包",
      dsc: "简单开发示例",
      event: "notice.group.poke",
      priority: 1,
      rule: [
        {
          reg: ".*",
          fnc: "capoo",
        },
      ],
    });
  }

  async capoo(e) {
    // 基础 URL，所有图片的基本路径
    const base_url = "https://git.acwing.com/XT/capoo/-/raw/main/gif/";
    // 生成一个随机数，范围在1到267之间
    const image_number = Math.floor(Math.random() * 267) + 1;
    // 构造图片的完整 URL
    const image_url = `${base_url}${image_number}.gif`;
    // 发送图片消息
    await e.reply(segment.image(image_url), true);
    return true;
  }
}
