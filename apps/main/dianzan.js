import plugin from "../../../../lib/plugins/plugin.js";
import common from "../../../../lib/common/common.js";
import schedule from "node-schedule";


const thumbsUpMelist = {

};
/** 点赞次数，非会员10次，会员20次 */
const thumbsUpMe_sum = 10;

/** 点赞消息推送文本 */
const thumbsUpMe_msg = "点了";

/** 被消息触发 */
export class dzxh extends plugin {
  constructor() {
    super({
      name: "点赞",
      dsc: "点赞",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^#*赞我$",
          fnc: "thumbsUpMe",
        },
      ],
    });
  }
  /** 赞我 */
  async thumbsUpMe() {
    Bot.pickFriend(this.e.user_id).thumbUp(thumbsUpMe_sum);
    this.e.reply(thumbsUpMe_msg);
    return true;
  }
}

/** 休眠函数
 * @time 毫秒
 */
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/** 主动触发-点赞
 * 点赞开始时间
 * cron表达式定义推送时间 (秒 分 时 日 月 星期)
 * 可使用此网站辅助生成：https://www.matools.com/cron/
 * 注意，每天都需要触发，因此日及以上选通配符或不指定
 * 只选小时就可以了
 */
schedule.scheduleJob("30 5 12 * * *", async () => {
  for (let qq of Object.keys(thumbsUpMelist)) {
    Bot.pickFriend(qq).thumbUp(thumbsUpMe_sum);
    logger.mark(`[自动点赞] 已给QQ${qq}点赞${thumbsUpMe_sum}次`);
    if (thumbsUpMelist[qq].push) {
      common.relpyPrivate(qq, thumbsUpMe_msg);
    }
    await sleep(10000); // 等10秒在下一个
  }
});
