import fsPromises from "fs/promises";
const _path = process.cwd();
const AnswerBookPath = `${_path}/plugins/xiaotan-plugin/resources/data/answersbook.json`;

export class example extends plugin {
  constructor() {
    super({
      name: "答案之书",
      dsc: "example",
      event: "message",
      priority: 1,
      rule: [
        {
          reg: "^#?答案之书([\\s\\S]*)$",
          fnc: "AnswersBook",
        },
      ],
    });
  }
  async AnswersBook(e) {
    try {
      // 读取答案之书数据
      const data = await fsPromises.readFile(AnswerBookPath, "utf8");
      const answerData = JSON.parse(data);

      // 将数据转换为数组
      const answers = Object.values(answerData).map((entry) => entry.answer);

      // 随机选择一个答案
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

      // 构建回复信息
      const replymessage = `📚答案之书提示您:📚\n${randomAnswer}`;

      // 回复用户
      e.reply(replymessage, false, { at: true });
      return true;
    } catch (error) {
      console.error("读取答案之书数据时出错:", error);
      e.reply("读取答案之书数据时出错，请稍后再试");
      return false;
    }
  }
}
