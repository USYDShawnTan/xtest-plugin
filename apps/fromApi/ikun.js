import fetch from "node-fetch";

export class kuntu extends plugin {
  constructor() {
    super({
      name: "随机坤图",
      dsc: "随机坤图",
      event: "message",
      priority: 100000,
      rule: [
        {
          reg: ".*?(坤|kun|黑子|只因|鸡|🐔|ji|zhiyin|太美|你干嘛|蔡|cxk).*",
          fnc: "kuntu",
        },
      ],
    });
  }

  // 定义一个异步函数 kuntu，参数 e 代表事件对象
  async kuntu(e) {
    // 基础 URL，所有图片的基本路径
    const base_url = "https://git.acwing.com/XT/ikun/-/raw/main/";
    // 定义三个图片批次的路径
    const batches = ["batch1/", "batch2/", "batch3/"];
    // 定义支持的图片格式
    const extensions = [".jpeg", ".jpg"];
    // 随机选择一个批次
    const batch_choice = batches[Math.floor(Math.random() * batches.length)];
    let image_number;
    // 根据所选批次，随机生成图片编号
    if (batch_choice === "batch1/") {
      // 如果是第一个批次，图片编号在1到210之间
      image_number = Math.floor(Math.random() * 210) + 1;
    } else if (batch_choice === "batch2/") {
      // 如果是第二个批次，图片编号在211到350之间
      image_number = Math.floor(Math.random() * (350 - 211 + 1)) + 211;
    } else {
      // 如果是第三个批次，图片编号在351到497之间
      image_number = Math.floor(Math.random() * (497 - 351 + 1)) + 351;
    }
    // 遍历所有支持的图片格式
    for (const ext of extensions) {
      // 构造图片的完整 URL
      const image_url = `${base_url}${batch_choice}${image_number}${ext}`;
      try {
        // 尝试访问图片 URL，只请求头部信息以检查图片是否可访问
        const response = await fetch(image_url, { method: "HEAD" });
        if (response.ok) {
          // 如果图片可访问，使用 segment 对象发送图片并结束函数
          await e.reply(segment.image(image_url), true);
          return true; // 成功找到并发送图片后，跳出循环
        }
      } catch (error) {
        // 如果访问图片时出现错误，记录错误信息，但不中断循环，尝试下一个图片格式
        console.error(`Error fetching image with extension ${ext}:`, error);
      }
    }
    // 如果所有格式的图片都不可访问，发送错误消息
    await e.reply("无法访问任何坤图，请稍后再试。");
    return false; // 返回 false，表示未能成功发送图片
  }
}
