import fetch from "node-fetch";

export class miao extends plugin {
  constructor() {
    super({
      name: "随机阿猫阿狗",
      dsc: "随机阿猫阿狗",
      event: "message",
      priority: 100000,
      rule: [
        {
          reg: ".*?(猫|miao|喵|🐱|猫猫|咪).*",
          fnc: "miao",
        },
        {
          reg: ".*?(狗|gou|🐶|勾|汪|狗子).*",
          fnc: "wang",
        },
      ],
    });
  }

  async miao(e) {
    // 替换为你的 API Key
    const apiKey =
      "live_jLo8pjtj7qgh0rIT5JGYO9TDZ287KCfRUq9R1kTcZ6KCN4t7GrqmpQH04f5JNuXN";
    // API 的 URL
    const url = `https://api.thecatapi.com/v1/images/search?limit=3&has_breeds=1&api_key=${apiKey}`;

    try {
      // 从 API 获取响应
      const response = await fetch(url);
      const miao = await response.json();
      // 检查数据是否为数组并且包含至少一个元素
      if (Array.isArray(miao) && miao.length > 0) {
        const forwardMsgs = miao.map((cat) => ({
          message: [
            segment.image(cat.url),
            `品种信息: ${cat.breeds.length > 0 ? cat.breeds[0].name : "未知"}`,
          ],
          nickname: e.sender.nickname,
        }));

        e.reply(await e.group.makeForwardMsg(forwardMsgs));
      } else {
        e.reply("没有找到猫猫图片，稍后再试噢~");
      }
    } catch (error) {
      // 错误处理，发送错误消息
      e.reply("出错啦~稍后再试噢");
    }
  }

  async wang(e) {
    // 替换为你的 API Key
    const apiKey =
      "live_S5R3Yq2r7fucBLOFuLMj2IWdvrQf72vGdQMD3u0uDd44mZCcrX0aQWb3MdAg8jGO";
    // API 的 URL
    const url = `https://api.thedogapi.com/v1/images/search?limit=3&has_breeds=1&api_key=${apiKey}`;

    try {
      // 从 API 获取响应
      const response = await fetch(url);
      const wang = await response.json();
      // 检查数据是否为数组并且包含至少一个元素
      if (Array.isArray(wang) && wang.length > 0) {
        const forwardMsgs = wang.map((dog) => ({
          message: [
            segment.image(dog.url),
            `品种信息: ${dog.breeds.length > 0 ? dog.breeds[0].name : "未知"}`,
          ],
          nickname: e.sender.nickname,
        }));

        e.reply(await e.group.makeForwardMsg(forwardMsgs));
      } else {
        e.reply("没有找到狗狗图片，稍后再试噢~");
      }
    } catch (error) {
      // 错误处理，发送错误消息
      e.reply("出错啦~稍后再试噢");
    }
  }
}
