export class example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: "测试",
      /** 功能描述 */
      dsc: "简单开发示例",
      /** https://oicqjs.github.io/oicq/#events */
      event: "message",
      /** 优先级，数字越小等级越高 */
      priority: 10086,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "小谈",
          /** 执行方法 */
          fnc: "xt",
        },
        {
          /** 命令正则匹配 */
          reg: "测试",
          /** 执行方法 */
          fnc: "cs",
        },
      ],
    });
  }

  async xt() {
    const msg = "小谈yyds";
    await this.e.reply(msg);
  }
  async cs() {
    const msg = "测试成功";
    await this.e.reply(msg);
  }
}
