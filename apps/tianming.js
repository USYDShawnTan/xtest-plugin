export class CoCPlugin extends plugin {
  constructor() {
    super({
      name: "天命插件",
      dsc: "生成随机天命属性",
      event: "message",
      priority: 1,
      rule: [
        {
          reg: "^#?(天命)$",
          fnc: "coc",
        },
        {
          reg: "^#?(我的天命)$",
          fnc: "getCoc",
        },
      ],
    });
  }

  async coc(e) {
    const userId = e.user_id;
    const STR = Math.floor(Math.random() * 76) + 15;
    const CON = Math.floor(Math.random() * 76) + 15;
    const SIZ = Math.floor(Math.random() * 76) + 15;
    const DEX = Math.floor(Math.random() * 76) + 15;
    const APP = Math.floor(Math.random() * 76) + 15;
    const POW = Math.floor(Math.random() * 76) + 15;
    const INT = Math.floor(Math.random() * 76) + 15;
    const EDU = Math.floor(Math.random() * 76) + 15;
      
    const attributes = { STR, CON, SIZ, DEX, APP, POW, INT, EDU };
    await redis.set(`Yunz:Coc:${userId}`, JSON.stringify(attributes));
      
    e.reply(`力量: ${STR}, 体质: ${CON}\n体型: ${SIZ}, 敏捷: ${DEX}\n外貌: ${APP}, 意志: ${POW}\n灵感: ${INT}, 教育: ${EDU}`, { at: true });
  }
    
  async getCoc(e) {
    const userId = e.user_id;
    const data = await redis.get(`Yunz:Coc:${userId}`);
    if (data) {
      const attributes = JSON.parse(data);
      const total = Object.values(attributes).reduce((sum, value) => sum + value, 0);
      e.reply(`你的天命属性:\n力量: ${attributes.STR}, 体质: ${attributes.CON}\n体型: ${attributes.SIZ}, 敏捷: ${attributes.DEX}\n外貌: ${attributes.APP}, 意志: ${attributes.POW}\n灵感: ${attributes.INT}, 教育: ${attributes.EDU}\n总计属性点数: ${total}`, { at: true });
    } else {
      e.reply("你还没有生成过天命属性，请先发送“天命”命令生成属性。");
    }
  }
}

export default new CoCPlugin();
