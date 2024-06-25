import { execSync } from "child_process";
import { update } from "../../../system/update.js";
import { Plugin_Name } from "../../components/index.js";

export class xiaotan_update extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: "小谈插件_更新",
      /** 功能描述 */
      dsc: "调用Yunzai自带更新模块进行插件更新",
      /** https://oicqjs.github.io/oicq/#events */
      event: "message",
      /** 优先级，数字越小等级越高 */
      priority: 2000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: "^#?小谈(插件)?(强制)?更新$",
          /** 执行方法 */
          fnc: "update_plugin",
          permission: "master",
        },
        {
          /** 命令正则匹配 */
          reg: "^#?小谈(插件)?更新日志$",
          /** 执行方法 */
          fnc: "update_log",
        },
      ],
    });
  }

  async update_plugin() {
    let Update_Plugin = new update();
    Update_Plugin.e = this.e;
    Update_Plugin.reply = this.reply;

    if (Update_Plugin.getPlugin(Plugin_Name)) {
      if (this.e.msg.includes("强制")) {
        await execSync("git reset --hard", {
          cwd: `${process.cwd()}/plugins/${Plugin_Name}/`,
        });
      }
      await Update_Plugin.runUpdate(Plugin_Name);
      if (Update_Plugin.isUp) {
        setTimeout(() => Update_Plugin.restart(), 2000);
      }
    }
    return true;
  }

  async plugin_version() {
    //await this.reply('小谈插件当前版本：'+Version.ver);
    return versionInfo(this.e);
  }

  async update_log() {
    let Update_Plugin = new update();
    Update_Plugin.e = this.e;
    Update_Plugin.reply = this.reply;

    if (Update_Plugin.getPlugin(Plugin_Name)) {
      this.e.reply(await Update_Plugin.getLog(Plugin_Name));
    }
    return true;
  }
}

