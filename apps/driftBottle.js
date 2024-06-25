import plugin from "../../../lib/plugins/plugin.js";
import fs from "fs/promises";
import fs_ from "node:fs";
import path from "path";
import moment from "moment";
import fetch from "node-fetch";

const _path = process.cwd();
const driftBottleDir = path.join(_path, 'resources/driftBottle');
const driftBottleJson = path.join(driftBottleDir, 'driftBottle.json');

// 创建目录
async function createDirectories() {
  if (!fs_.existsSync(driftBottleDir)) {
    fs_.mkdirSync(driftBottleDir, { recursive: true });
  }
  if (!fs_.existsSync(driftBottleJson)) {
    await fs.writeFile(driftBottleJson, JSON.stringify([]), "utf8");
  }
}

// 下载图片函数
async function downloadImage(url, filename) {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.join(driftBottleDir, filename);
  await fs.writeFile(filePath, buffer);
  console.log(`Image downloaded to ${filePath}`);
  return filePath;
}

export class driftBottle extends plugin {
  constructor() {
    super({
      name: "漂流瓶",
      dsc: "捡起或丢弃一个漂流瓶吧~",
      event: "message",
      priority: 10,
      rule: [
        {
          reg: "^#?(扔|丢)漂流瓶([^]*)$",
          fnc: "throwDriftBottle",
        },
        {
          reg: "^#?(捡|捞)?漂流瓶$",
          fnc: "getDriftBottle",
        },
        {
          reg: "^#?(查询|获取)?漂流瓶(数|数量)$",
          fnc: "queryDriftBottleNumber",
        },
      ],
    });
  }

  async init() {
    await createDirectories();
  }

  async throwDriftBottle(e) {
    await createDirectories();  // 确保目录和文件存在
    const content = e.msg.replace(/^#?(扔|丢)漂流瓶/g, '').trim();
    let replyContent = '';
    let replyImgPath = null;

    const replySegment = e.message.find((msg) => msg.type === 'reply');
    if (replySegment) {
      const replyMsgId = replySegment.id;
      // 使用 message_id 获取消息
      const replyMsg = await e.group.getMsg(replyMsgId);
      if (replyMsg) {
        replyContent = replyMsg.message.filter(m => m.type === 'text').map(m => m.text).join(' ');
        const replyImg = replyMsg.message.find(m => m.type === 'image');
        if (replyImg) {
          const fileName = `${Date.now()}_reply.jpg`;
          replyImgPath = await downloadImage(replyImg.url, fileName);
        }
      }
    }

    if (!content && !replyContent && !e.img && !replyImgPath) {
      return e.reply("你还没有写入任何想丢的内容哦~");
    }

    let formattedDate = moment().format("YYYY.MM.DD HH:mm:ss");
    let data = JSON.parse(await fs.readFile(driftBottleJson, "utf8"));

    let imgPath = null;
    if (e.img && e.img.length > 0) {
      const imgLink = e.img[0];
      const fileName = `${Date.now()}.jpg`;
      imgPath = await downloadImage(imgLink, fileName);
    }

    data.push({ content, replyContent, date: formattedDate, imgPath: imgPath || replyImgPath });

    await fs.writeFile(driftBottleJson, JSON.stringify(data, null, 2), "utf8");

    let replyMessage = `漂流瓶随着诗歌流向远方\n丢弃时间：${formattedDate}`;
    if (content) replyMessage += `\n其中内容：${content}`;
    if (replyContent) replyMessage += `\n回复内容：${replyContent}`;
    if (imgPath || replyImgPath) replyMessage += `\n附带图片一张`;

    await e.reply(replyMessage);
    return true;
  }

  async getDriftBottle(e) {
    await createDirectories();  // 确保目录和文件存在
    let data = JSON.parse(await fs.readFile(driftBottleJson, "utf8"));
    if (data.length === 0) {
      return e.reply("大海中没有漂流瓶了");
    }

    let randomIndex = Math.floor(Math.random() * data.length);
    let selectedItem = data[randomIndex];
    let replyMessage = `你在海边的沙滩散步，一个长了脚的漂流瓶向你走过来\n丢弃时间：${selectedItem.date}`;
    if (selectedItem.content) replyMessage += `\n内容：${selectedItem.content}`;
    if (selectedItem.replyContent) replyMessage += `\n回复内容：${selectedItem.replyContent}`;
    if (selectedItem.imgPath) {
      replyMessage += `\n已经褪色的图片：`;
    }
    await e.reply([replyMessage, selectedItem.imgPath ? segment.image(selectedItem.imgPath) : null].filter(Boolean));

    // 如果有图片路径，则删除该图片
    if (selectedItem.imgPath) {
      try {
        await fs.unlink(selectedItem.imgPath);
        console.log(`Image deleted: ${selectedItem.imgPath}`);
      } catch (err) {
        console.error(`Failed to delete image: ${selectedItem.imgPath}`, err);
      }
    }

    data.splice(randomIndex, 1);
    await fs.writeFile(driftBottleJson, JSON.stringify(data, null, 2), "utf8");
    return true;
  }

  async queryDriftBottleNumber(e) {
    await createDirectories();  // 确保目录和文件存在
    const data = JSON.parse(await fs.readFile(driftBottleJson, "utf8"));
    const realDriftBottleNumber = data.length;
    await e.reply(`大海告诉我他里面有${realDriftBottleNumber}个漂流瓶哦~`);
    return true;
  }
}
